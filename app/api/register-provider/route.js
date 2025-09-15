import { NextResponse } from "next/server";
import { connectToDatabase } from "@/config/db";
import ServiceProvider from "@/models/ServiceProvider";

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const {
      fullName,
      email,
      password,
      businessName,
      phone,
      description,
      location,
      pricingType,
      baseRate,
      categories
    } = body;

    // Check if provider already exists
    const existingProvider = await ServiceProvider.findOne({ userId: email });
    if (existingProvider) {
      return NextResponse.json(
        { message: "Provider with this email already exists" },
        { status: 400 }
      );
    }

    // For now, store password as plain text (you should implement proper hashing in production)
    // const hashedPassword = await bcrypt.hash(password, 12);

    // Create new service provider
    const newProvider = new ServiceProvider({
      userId: email, // Using email as temporary userId
      businessName,
      description,
      categories: categories,
      pricing: {
        type: pricingType,
        hourlyRate: parseFloat(baseRate),
        currency: 'INR'
      },
      serviceAreas: [{
        areaName: location,
        radiusKm: 10
      }],
      isVerified: false,
      isActive: true,
      verificationStatus: 'pending'
    });

    await newProvider.save();

    return NextResponse.json(
      { 
        message: "Service provider registered successfully",
        providerId: newProvider._id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
