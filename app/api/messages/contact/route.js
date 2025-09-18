import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import Booking from "@/models/Booking";
import Message from "@/models/Message";
import ServiceProvider from "@/models/ServiceProvider";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    const body = await request.json();
    const { providerId, text } = body || {};

    if (!providerId || !text) return NextResponse.json({ error: "Missing providerId or text" }, { status: 400 });

    const provider = await ServiceProvider.findById(providerId).lean();
    if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });

    // Create a lightweight pending booking to anchor the conversation
    const booking = new Booking({
      userId,
      serviceProviderId: providerId,
      serviceType: 'inquiry',
      category: provider.categories?.[0] || 'other',
      description: `Inquiry with ${provider.businessName}`,
      scheduledDate: new Date(Date.now() + 24*60*60*1000),
      scheduledTime: '10:00',
      duration: 30,
      serviceLocation: {
        address: 'Not provided',
        city: 'Not provided',
        state: 'Not provided',
        pincode: '000000'
      },
      pricing: {
        serviceCharge: 0,
        platformFee: 0,
        taxes: 0,
        discount: 0,
        totalAmount: 0,
        currency: 'INR'
      },
      payment: {
        method: 'cod',
        status: 'pending'
      },
      status: 'pending',
      timeline: [{ status: 'pending', updatedBy: userId }]
    });
    await booking.save();

    const message = new Message({
      senderId: userId,
      receiverId: provider.userId,
      bookingId: booking._id,
      messageType: 'text',
      content: { text }
    });
    await message.save();

    return NextResponse.json({ ok: true, data: { bookingId: booking._id, messageId: message._id } }, { status: 201 });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
