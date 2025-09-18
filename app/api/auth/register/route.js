import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import User from "@/models/User";

// Helper: normalize various "location" shapes into our schema with GeoJSON Point
function normalizeLocation(input) {
    if (!input || typeof input !== 'object') return undefined;

    const out = {};
    // Pass-through address fields if provided
    if (typeof input.address === 'string') out.address = input.address;
    if (typeof input.city === 'string') out.city = input.city;
    if (typeof input.state === 'string') out.state = input.state;
    if (typeof input.pincode === 'string') out.pincode = input.pincode;

    // Determine coordinates from multiple possible shapes
    let lngLat;

    // Case: input has latitude/longitude at root
    if (typeof input.longitude === 'number' && typeof input.latitude === 'number') {
        lngLat = [input.longitude, input.latitude];
    }

    // Case: input.coordinates is [lng, lat]
    if (!lngLat && Array.isArray(input.coordinates) && input.coordinates.length === 2) {
        const [lng, lat] = input.coordinates;
        if (typeof lng === 'number' && typeof lat === 'number') {
            lngLat = [lng, lat];
        }
    }

    // Case: input.coordinates is an object possibly with lat/lng
    if (!lngLat && input.coordinates && typeof input.coordinates === 'object') {
        const c = input.coordinates;
        // GeoJSON object provided correctly
        if (c.type === 'Point' && Array.isArray(c.coordinates) && c.coordinates.length === 2) {
            const [lng, lat] = c.coordinates;
            if (typeof lng === 'number' && typeof lat === 'number') {
                lngLat = [lng, lat];
            }
        } else if (typeof c.longitude === 'number' && typeof c.latitude === 'number') {
            lngLat = [c.longitude, c.latitude];
        } else if (typeof c.lng === 'number' && typeof c.lat === 'number') {
            lngLat = [c.lng, c.lat];
        }
    }

    if (lngLat) {
        out.coordinates = { type: 'Point', coordinates: lngLat };
    }

    // If nothing useful, return undefined so we don't persist an invalid shape
    return Object.keys(out).length ? out : undefined;
}

export async function POST(request) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { email, name, imageUrl, phone, role, location } = body;

        // Connect to database
        await connectDb();

        // Check if user already exists
        const existingUser = await User.findById(userId);
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists", user: existingUser },
                { status: 200 }
            );
        }

        // Create new user
        const newUserData = {
            _id: userId,
            email,
            name,
            imageUrl,
            phone,
            role: role || 'user',
            // Only include location if valid/normalized
            ...(normalizeLocation(location) ? { location: normalizeLocation(location) } : {}),
            isVerified: false,
            isActive: true,
            lastLogin: new Date()
        };

        const newUser = new User(newUserData);

        await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully", user: newUser },
            { status: 201 }
        );

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDb();
        
        const user = await User.findById(userId);
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return NextResponse.json(
            { user },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
