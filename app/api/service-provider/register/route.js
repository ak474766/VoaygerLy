import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import User from "@/models/User";
import ServiceProvider from "@/models/ServiceProvider";

// Helper: normalize to GeoJSON Point for service area locations
function normalizePoint(input) {
    if (!input || typeof input !== 'object') return undefined;
    // Cases: { longitude, latitude } OR [lng, lat] OR { type:'Point', coordinates:[lng,lat] } OR { lng, lat }
    if (typeof input.longitude === 'number' && typeof input.latitude === 'number') {
        return { type: 'Point', coordinates: [input.longitude, input.latitude] };
    }
    if (Array.isArray(input) && input.length === 2 && typeof input[0] === 'number' && typeof input[1] === 'number') {
        return { type: 'Point', coordinates: [input[0], input[1]] };
    }
    if (input.type === 'Point' && Array.isArray(input.coordinates) && input.coordinates.length === 2) {
        const [lng, lat] = input.coordinates;
        if (typeof lng === 'number' && typeof lat === 'number') return { type: 'Point', coordinates: [lng, lat] };
    }
    if (typeof input.lng === 'number' && typeof input.lat === 'number') {
        return { type: 'Point', coordinates: [input.lng, input.lat] };
    }
    return undefined;
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
        const { 
            businessName, 
            description, 
            categories, 
            skills, 
            pricing, 
            serviceAreas, 
            availability 
        } = body;

        await connectDb();

        // Check if user exists and update role to serviceProvider
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update user role to serviceProvider
        user.role = 'serviceProvider';
        await user.save();

        // Check if service provider profile already exists
        const existingProvider = await ServiceProvider.findOne({ userId });
        if (existingProvider) {
            return NextResponse.json(
                { message: "Service provider profile already exists", provider: existingProvider },
                { status: 200 }
            );
        }

        // Normalize service areas: only keep entries with valid GeoJSON Point
        let normalizedServiceAreas = Array.isArray(serviceAreas) ? serviceAreas.map(sa => {
            const location = normalizePoint(sa?.location || sa?.coordinates || sa);
            if (!location) return undefined;
            return {
                location,
                radiusKm: typeof sa?.radiusKm === 'number' ? sa.radiusKm : 10,
                areaName: typeof sa?.areaName === 'string' ? sa.areaName : undefined
            };
        }).filter(Boolean) : [];

        // Create service provider profile
        const newProvider = new ServiceProvider({
            userId,
            businessName,
            description,
            categories,
            skills: skills || [],
            pricing: pricing || {
                type: 'hourly',
                hourlyRate: 0,
                currency: 'INR'
            },
            serviceAreas: normalizedServiceAreas,
            availability: availability || {
                workingDays: [],
                timeSlotDuration: 60,
                advanceBookingDays: 30
            },
            photos: [],
            documents: [],
            rating: {
                average: 0,
                count: 0
            },
            isVerified: false,
            isActive: true,
            verificationStatus: 'pending',
            stats: {
                totalBookings: 0,
                completedBookings: 0,
                cancelledBookings: 0,
                totalEarnings: 0,
                responseTime: 0,
                joinedDate: new Date()
            },
            settings: {
                autoAcceptBookings: false,
                instantBooking: true,
                cancellationPolicy: 'moderate'
            }
        });

        await newProvider.save();

        return NextResponse.json(
            { message: "Service provider registered successfully", provider: newProvider },
            { status: 201 }
        );

    } catch (error) {
        console.error("Service provider registration error:", error);
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
        
        const provider = await ServiceProvider.findOne({ userId }).populate('userId');
        
        if (!provider) {
            return NextResponse.json(
                { error: "Service provider not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { provider },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get service provider error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
