import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import User from "@/models/User";
import ServiceProvider from "@/models/ServiceProvider";

// GET /api/admin/providers - List all providers with filters
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    // Check if user is admin
    const user = await User.findById(userId).lean();
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, verified, rejected
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.verificationStatus = status;
    }

    const [providers, total] = await Promise.all([
      ServiceProvider.find(query)
        .populate('userId', 'name email imageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ServiceProvider.countDocuments(query)
    ]);

    return NextResponse.json({
      ok: true,
      data: providers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin providers list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/providers - Update provider verification status
export async function PUT(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDb();

    // Check if user is admin
    const user = await User.findById(userId).lean();
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { providerId, verificationStatus, notes } = body || {};

    if (!providerId || !verificationStatus) {
      return NextResponse.json({ error: 'Missing providerId or verificationStatus' }, { status: 400 });
    }

    if (!['pending', 'in-review', 'verified', 'rejected'].includes(verificationStatus)) {
      return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
    }

    const updateData = {
      verificationStatus,
      isVerified: verificationStatus === 'verified'
    };

    if (notes) {
      updateData.verificationNotes = notes;
    }

    const provider = await ServiceProvider.findByIdAndUpdate(
      providerId,
      updateData,
      { new: true }
    ).populate('userId', 'name email');

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: provider,
      message: `Provider ${verificationStatus} successfully`
    });
  } catch (error) {
    console.error('Admin provider update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
