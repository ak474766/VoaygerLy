import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDb from "@/config/db";
import User from "@/models/User";

// POST /api/admin/create-test-user - Create test users for development
export async function POST(request) {
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
    const { targetUserId, role } = body || {};

    if (!targetUserId || !role) {
      return NextResponse.json({ error: 'Missing targetUserId or role' }, { status: 400 });
    }

    if (!['user', 'serviceProvider', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be: user, serviceProvider, or admin' }, { status: 400 });
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: updatedUser,
      message: `User role updated to ${role} successfully`
    });
  } catch (error) {
    console.error('Create test user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/admin/create-test-user - Get all users for role management
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

    const users = await User.find({})
      .select('_id name email role isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      ok: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
