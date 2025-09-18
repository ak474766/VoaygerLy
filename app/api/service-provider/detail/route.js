import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import ServiceProvider from "@/models/ServiceProvider";

// GET /api/service-provider/detail?id=<providerId>
export async function GET(request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    const provider = await ServiceProvider.findById(id).lean();
    if (!provider) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: provider });
  } catch (error) {
    console.error("Get provider detail error:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
