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

// Helper: normalize various "location" shapes into our schema with GeoJSON Point
function normalizeLocation(input) {
  if (!input || typeof input !== "object") return undefined;

  const out = {};
  if (typeof input.address === "string") out.address = input.address;
  if (typeof input.city === "string") out.city = input.city;
  if (typeof input.state === "string") out.state = input.state;
  if (typeof input.pincode === "string") out.pincode = input.pincode;

  let lngLat;
  if (typeof input.longitude === "number" && typeof input.latitude === "number") {
    lngLat = [input.longitude, input.latitude];
  }
  if (!lngLat && Array.isArray(input.coordinates) && input.coordinates.length === 2) {
    const [lng, lat] = input.coordinates;
    if (typeof lng === "number" && typeof lat === "number") lngLat = [lng, lat];
  }
  if (!lngLat && input.coordinates && typeof input.coordinates === "object") {
    const c = input.coordinates;
    if (c.type === "Point" && Array.isArray(c.coordinates) && c.coordinates.length === 2) {
      const [lng, lat] = c.coordinates;
      if (typeof lng === "number" && typeof lat === "number") lngLat = [lng, lat];
    } else if (typeof c.longitude === "number" && typeof c.latitude === "number") {
      lngLat = [c.longitude, c.latitude];
    } else if (typeof c.lng === "number" && typeof c.lat === "number") {
      lngLat = [c.lng, c.lat];
    }
  }

  if (lngLat) {
    out.coordinates = { type: "Point", coordinates: lngLat };
  }

  return Object.keys(out).length ? out : undefined;
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
    const { id, email, name, imageUrl, cartItems, location } = body || {};

    if (!id || !email || !name || !imageUrl) {
      return Response.json({ ok: false, error: "Missing required fields: id, email, name, imageUrl" }, { status: 400 });
    }

    const userDoc = {
      _id: id,
      email,
      name,
      imageUrl,
      ...(cartItems ? { cartItems } : {}),
      ...(normalizeLocation(location) ? { location: normalizeLocation(location) } : {}),
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
    const { id, location, ...rest } = body || {};
    if (!id) return Response.json({ ok: false, error: "Missing required field: id" }, { status: 400 });

    // Build an update with $set/$unset so we can remove invalid location when requested
    const setDoc = { ...rest };
    const norm = normalizeLocation(location);
    if (norm) {
      setDoc.location = norm;
    }

    const updateDoc = {};
    if (Object.keys(setDoc).length) updateDoc.$set = setDoc;

    // If client explicitly sends location: null, unset the field
    if (location === null) {
      updateDoc.$unset = { ...(updateDoc.$unset || {}), location: 1 };
    }

    const updated = await User.findByIdAndUpdate(id, updateDoc, { new: true });
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
