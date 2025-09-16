import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import User from "@/models/User";

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
        const newUser = new User({
            _id: userId,
            email,
            name,
            imageUrl,
            phone,
            role: role || 'user',
            location: location || {},
            isVerified: false,
            isActive: true,
            lastLogin: new Date()
        });

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
