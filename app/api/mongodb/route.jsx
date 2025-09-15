import mongoose from "mongoose";
import connectDb from "@/config/db";

// GET /api/mongodb
// Simple health check that verifies MongoDB connectivity
export async function GET() {
  try {
    const conn = await connectDb();

    const readyState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    return Response.json({
      ok: readyState === 1,
      readyState,
      host: conn?.connection?.host,
      name: conn?.connection?.name,
    });
  } catch (err) {
    return Response.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
