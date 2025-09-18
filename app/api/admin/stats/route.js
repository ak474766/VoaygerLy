import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import User from "@/models/User";
import ServiceProvider from "@/models/ServiceProvider";
import Booking from "@/models/Booking";
import Review from "@/models/Review";

// GET /api/admin/stats
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    // Check if user is admin
    const user = await User.findById(userId).lean();
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get platform statistics
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      completedBookings,
      pendingProviders,
      totalReviews,
      recentBookings
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      ServiceProvider.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'completed' }),
      ServiceProvider.countDocuments({ verificationStatus: 'pending' }),
      Review.countDocuments({ 'moderation.status': 'approved' }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('serviceProviderId', 'businessName')
        .lean()
    ]);

    // Calculate total revenue from completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed', 'payment.status': 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Get monthly booking trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        overview: {
          totalUsers,
          totalProviders,
          totalBookings,
          completedBookings,
          pendingProviders,
          totalReviews,
          totalRevenue,
          completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0
        },
        recentBookings,
        monthlyTrends: monthlyBookings
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
