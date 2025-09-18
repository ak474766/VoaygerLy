import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import Booking from "@/models/Booking";
import ServiceProvider from "@/models/ServiceProvider";

// GET /api/bookings/my
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).lean();

    const ids = [...new Set(bookings.map(b => b.serviceProviderId).filter(Boolean))];
    const providers = await ServiceProvider.find({ _id: { $in: ids } })
      .select("businessName pricing.hourlyRate rating.average photos")
      .lean();
    const byId = Object.fromEntries(providers.map(p => [String(p._id), p]));

    const data = bookings.map(b => ({
      ...b,
      provider: byId[String(b.serviceProviderId)] || null,
    }));

    return NextResponse.json({ ok: true, count: data.length, data });
  } catch (error) {
    console.error('My bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
