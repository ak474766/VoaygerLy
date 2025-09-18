import { NextResponse } from "next/server";

// This legacy route has been deprecated in favor of /api/service-provider/register
// Keeping this file to avoid 404s from older clients. Respond with 410 Gone.
export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Use POST /api/service-provider/register instead.",
    },
    { status: 410 }
  );
}
