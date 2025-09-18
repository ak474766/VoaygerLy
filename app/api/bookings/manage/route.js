import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import Booking from "@/models/Booking";
import ServiceProvider from "@/models/ServiceProvider";
import User from "@/models/User";

// POST /api/bookings/manage
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    const body = await request.json();
    const { bookingId, action, notes } = body || {};

    if (!bookingId || !action) {
      return NextResponse.json({ error: 'Missing bookingId or action' }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user is authorized to perform this action
    const user = await User.findById(userId).lean();
    const provider = await ServiceProvider.findOne({ userId }).lean();
    
    const isCustomer = booking.userId === userId;
    const isProvider = provider && String(booking.serviceProviderId) === String(provider._id);
    const isAdmin = user?.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized to manage this booking' }, { status: 403 });
    }

    let newStatus = booking.status;
    let updateData = {};

    switch (action) {
      case 'accept':
        if (!isProvider && !isAdmin) {
          return NextResponse.json({ error: 'Only provider can accept bookings' }, { status: 403 });
        }
        if (booking.status !== 'pending') {
          return NextResponse.json({ error: 'Can only accept pending bookings' }, { status: 400 });
        }
        newStatus = 'confirmed';
        break;

      case 'decline':
        if (!isProvider && !isAdmin) {
          return NextResponse.json({ error: 'Only provider can decline bookings' }, { status: 403 });
        }
        if (booking.status !== 'pending') {
          return NextResponse.json({ error: 'Can only decline pending bookings' }, { status: 400 });
        }
        newStatus = 'cancelled';
        updateData.cancellation = {
          cancelledBy: userId,
          cancelledAt: new Date(),
          reason: notes || 'Declined by service provider'
        };
        break;

      case 'start':
        if (!isProvider && !isAdmin) {
          return NextResponse.json({ error: 'Only provider can start service' }, { status: 403 });
        }
        if (booking.status !== 'confirmed') {
          return NextResponse.json({ error: 'Can only start confirmed bookings' }, { status: 400 });
        }
        newStatus = 'in-progress';
        break;

      case 'complete':
        if (!isProvider && !isAdmin) {
          return NextResponse.json({ error: 'Only provider can complete service' }, { status: 403 });
        }
        if (booking.status !== 'in-progress') {
          return NextResponse.json({ error: 'Can only complete in-progress bookings' }, { status: 400 });
        }
        newStatus = 'completed';
        updateData.completion = {
          completedAt: new Date(),
          workDescription: notes || 'Service completed successfully'
        };
        // Update payment status to paid for COD
        if (booking.payment.method === 'cod') {
          updateData['payment.status'] = 'paid';
          updateData['payment.paidAt'] = new Date();
          updateData['payment.codAmount'] = booking.pricing.totalAmount;
        }
        break;

      case 'cancel':
        if (booking.status === 'completed') {
          return NextResponse.json({ error: 'Cannot cancel completed bookings' }, { status: 400 });
        }
        newStatus = 'cancelled';
        updateData.cancellation = {
          cancelledBy: userId,
          cancelledAt: new Date(),
          reason: notes || (isCustomer ? 'Cancelled by customer' : 'Cancelled by provider')
        };
        break;

      case 'no-show':
        if (!isCustomer && !isAdmin) {
          return NextResponse.json({ error: 'Only customer can mark as no-show' }, { status: 403 });
        }
        if (booking.status !== 'confirmed') {
          return NextResponse.json({ error: 'Can only mark confirmed bookings as no-show' }, { status: 400 });
        }
        newStatus = 'no-show';
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update booking
    updateData.status = newStatus;
    updateData.$push = {
      timeline: {
        status: newStatus,
        timestamp: new Date(),
        updatedBy: userId,
        notes: notes || ''
      }
    };

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );

    // Update provider stats
    if (isProvider && provider) {
      await updateProviderStats(provider._id, action, newStatus);
    }

    return NextResponse.json({ 
      ok: true, 
      data: updatedBooking,
      message: `Booking ${action}ed successfully`
    });

  } catch (error) {
    console.error('Booking management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update provider statistics
async function updateProviderStats(providerId, action, newStatus) {
  try {
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) return;

    switch (action) {
      case 'accept':
        // No stats update needed for acceptance
        break;
      case 'complete':
        provider.stats.completedBookings += 1;
        provider.stats.totalEarnings += 0; // Will be updated when payment is processed
        break;
      case 'cancel':
      case 'decline':
        provider.stats.cancelledBookings += 1;
        break;
    }

    await provider.save();
  } catch (error) {
    console.error('Update provider stats error:', error);
  }
}
