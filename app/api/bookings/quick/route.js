import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import Booking from "@/models/Booking";
import ServiceProvider from "@/models/ServiceProvider";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    const body = await request.json();
    const {
      providerId,
      category,
      description,
      scheduledDate,
      scheduledTime,
      duration,
      address,
      city,
      state,
      pincode,
      paymentMethod = 'cod'
    } = body || {};

    if (!providerId) return NextResponse.json({ error: "Missing providerId" }, { status: 400 });
    if (!address || !city || !state || !pincode)
      return NextResponse.json({ error: "Address fields are required: address, city, state, pincode" }, { status: 400 });

    const provider = await ServiceProvider.findById(providerId).lean();
    if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });

    const cat = category || provider.categories?.[0] || 'other';
    const desc = description || `Booking for ${provider.businessName}`;
    const dur = Number(duration || 60);
    const schedDate = scheduledDate ? new Date(scheduledDate) : new Date(Date.now() + 24*60*60*1000);
    const schedTime = scheduledTime || '10:00';

    const rate = Number(provider?.pricing?.hourlyRate || 0);
    const hours = Math.max(1, Math.ceil(dur / 60));
    const serviceCharge = rate * hours;
    const platformFee = Math.round(serviceCharge * 0.1);
    const taxes = Math.round(serviceCharge * 0.18);
    const totalAmount = serviceCharge + platformFee + taxes;

    const booking = new Booking({
      userId,
      serviceProviderId: providerId,
      serviceType: 'on-site',
      category: cat,
      description: desc,
      scheduledDate: schedDate,
      scheduledTime: schedTime,
      duration: dur,
      serviceLocation: {
        address, city, state, pincode
      },
      pricing: {
        serviceCharge,
        platformFee,
        taxes,
        discount: 0,
        totalAmount,
        currency: 'INR'
      },
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      status: 'pending',
      timeline: [{ status: 'pending', updatedBy: userId }]
    });

    await booking.save();

    return NextResponse.json({ ok: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error('Quick booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
