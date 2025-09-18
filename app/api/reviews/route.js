import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import ServiceProvider from "@/models/ServiceProvider";

// GET /api/reviews?providerId=...
export async function GET(request) {
  try {
    await connectDb();
    
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const limit = Number(searchParams.get('limit') || 20);
    
    if (!providerId) {
      return NextResponse.json({ error: 'Missing providerId' }, { status: 400 });
    }
    
    const reviews = await Review.find({ 
      serviceProviderId: providerId,
      'moderation.status': 'approved'
    })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .lean();
    
    return NextResponse.json({ ok: true, data: reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    const body = await request.json();
    const { 
      bookingId, 
      rating, 
      title, 
      comment, 
      detailedRating 
    } = body || {};

    if (!bookingId || !rating) {
      return NextResponse.json({ error: 'Missing bookingId or rating' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized - not your booking' }, { status: 403 });
    }

    if (booking.status !== 'completed') {
      return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId }).lean();
    if (existingReview) {
      return NextResponse.json({ error: 'Review already exists for this booking' }, { status: 400 });
    }

    // Create review
    const review = new Review({
      userId,
      serviceProviderId: booking.serviceProviderId,
      bookingId,
      rating,
      title: title || '',
      comment: comment || '',
      detailedRating: detailedRating || {},
      moderation: {
        status: 'approved' // Auto-approve for now
      }
    });

    await review.save();

    // Update booking to mark as reviewed
    await Booking.findByIdAndUpdate(bookingId, { hasReview: true });

    // Update service provider rating
    await updateProviderRating(booking.serviceProviderId);

    return NextResponse.json({ ok: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to recalculate provider rating
async function updateProviderRating(providerId) {
  try {
    const reviews = await Review.find({ 
      serviceProviderId: providerId,
      'moderation.status': 'approved'
    }).lean();

    if (reviews.length === 0) {
      await ServiceProvider.findByIdAndUpdate(providerId, {
        'rating.average': 0,
        'rating.count': 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await ServiceProvider.findByIdAndUpdate(providerId, {
      'rating.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
      'rating.count': reviews.length
    });
  } catch (error) {
    console.error('Update provider rating error:', error);
  }
}
