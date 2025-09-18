import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import ServiceProvider from "@/models/ServiceProvider";

// GET /api/messages?bookingId=...
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });

    // Authorization: ensure the requesting user is a participant of the booking
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Determine provider's userId
    const provider = await ServiceProvider.findById(booking.serviceProviderId).lean();
    const providerUserId = provider?.userId;
    const isParticipant = booking.userId === userId || providerUserId === userId;
    if (!isParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ ok: true, data: messages });
  } catch (error) {
    console.error('Messages GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages  { bookingId, text }
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    const body = await request.json();
    const { bookingId, text } = body || {};
    if (!bookingId || !text) return NextResponse.json({ error: 'Missing bookingId or text' }, { status: 400 });

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Authorization: ensure the sender is a participant in the booking
    const provider = await ServiceProvider.findById(booking.serviceProviderId).lean();
    const providerUserId = provider?.userId;
    const isParticipant = booking.userId === userId || providerUserId === userId;
    if (!isParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Determine receiver: if sender is the user, receiver is provider.userId; otherwise vice versa
    const receiverId = userId === booking.userId ? providerUserId : booking.userId;

    const msg = await Message.create({
      senderId: userId,
      receiverId,
      bookingId,
      messageType: 'text',
      content: { text }
    });

    return NextResponse.json({ ok: true, data: msg }, { status: 201 });
  } catch (error) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

