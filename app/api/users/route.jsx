import connectDb from "@/config/db";
import User from "@/models/User";

// Helper to parse JSON body safely
async function readJson(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

// GET /api/users?id=123
// - If id is provided, returns that user; otherwise returns up to 50 users
export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const user = await User.findById(id);
      if (!user) return Response.json({ ok: false, error: "User not found" }, { status: 404 });
      return Response.json({ ok: true, data: user });
    }

    const users = await User.find({}).limit(50).lean();
    return Response.json({ ok: true, count: users.length, data: users });
  } catch (err) {
    return Response.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}

// POST /api/users
// - Creates or upserts a user document. Body: { id, email, name, imageUrl, cartItems? }
export async function POST(req) {
  try {
    await connectDb();
    const body = await readJson(req);
    const { id, email, name, imageUrl, cartItems } = body || {};

    if (!id || !email || !name || !imageUrl) {
      return Response.json({ ok: false, error: "Missing required fields: id, email, name, imageUrl" }, { status: 400 });
    }

    const userDoc = {
      _id: id,
      email,
      name,
      imageUrl,
      ...(cartItems ? { cartItems } : {}),
    };

    const saved = await User.findByIdAndUpdate(id, userDoc, { new: true, upsert: true, setDefaultsOnInsert: true });
    return Response.json({ ok: true, data: saved }, { status: 201 });
  } catch (err) {
    return Response.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}

// PUT /api/users
// - Updates a user by id. Body: { id, ...fields }
export async function PUT(req) {
  try {
    await connectDb();
    const body = await readJson(req);
    const { id, ...updates } = body || {};
    if (!id) return Response.json({ ok: false, error: "Missing required field: id" }, { status: 400 });

    const updated = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    return Response.json({ ok: true, data: updated });
  } catch (err) {
    return Response.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}

// DELETE /api/users?id=123 (or send { id } in body)
export async function DELETE(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get("id");
    const body = await readJson(req);
    const id = queryId || body?.id;
    if (!id) return Response.json({ ok: false, error: "Missing required field: id" }, { status: 400 });

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    return Response.json({ ok: true, data: { id } });
  } catch (err) {
    return Response.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
