import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import Service from "@/models/Service";
import ServiceProvider from "@/models/ServiceProvider";

// GET - Fetch all services or services by provider
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const providerId = searchParams.get('providerId');
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        const status = searchParams.get('status') || 'active';

        await connectDb();

        let query = { status };

        if (providerId) {
            query.serviceProviderId = providerId;
        }
        if (category) {
            query.category = category;
        }
        if (city) {
            query['serviceAreas.city'] = { $regex: city, $options: 'i' };
        }

        const services = await Service.find(query)
            .populate('serviceProviderId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ services }, { status: 200 });

    } catch (error) {
        console.error("Get services error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new service
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
        
        await connectDb();

        // Check if user is a service provider
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return NextResponse.json(
                { error: "Service provider profile not found" },
                { status: 404 }
            );
        }

        // Create new service
        const newService = new Service({
            ...body,
            serviceProviderId: serviceProvider._id
        });

        await newService.save();

        return NextResponse.json(
            { message: "Service created successfully", service: newService },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create service error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update service
export async function PUT(request) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { serviceId, ...updateData } = body;

        await connectDb();

        // Check if user owns this service
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return NextResponse.json(
                { error: "Service provider profile not found" },
                { status: 404 }
            );
        }

        const service = await Service.findOne({ 
            serviceId, 
            serviceProviderId: serviceProvider._id 
        });

        if (!service) {
            return NextResponse.json(
                { error: "Service not found or unauthorized" },
                { status: 404 }
            );
        }

        // Update service
        Object.assign(service, updateData);
        await service.save();

        return NextResponse.json(
            { message: "Service updated successfully", service },
            { status: 200 }
        );

    } catch (error) {
        console.error("Update service error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete service
export async function DELETE(request) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get('serviceId');

        await connectDb();

        // Check if user owns this service
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return NextResponse.json(
                { error: "Service provider profile not found" },
                { status: 404 }
            );
        }

        const service = await Service.findOneAndDelete({ 
            serviceId, 
            serviceProviderId: serviceProvider._id 
        });

        if (!service) {
            return NextResponse.json(
                { error: "Service not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Service deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Delete service error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
