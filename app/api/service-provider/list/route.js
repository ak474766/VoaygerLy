import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import ServiceProvider from "@/models/ServiceProvider";

// GET /api/service-provider/list
// Optional query params: category, minRating, city, lat, lng, radius, limit
export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minRating = Number(searchParams.get("minRating") || 0);
    const city = searchParams.get("city");
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const radius = Number(searchParams.get("radius") || 10000); // Default 10km in meters
    const limit = Number(searchParams.get("limit") || 50);

    let query = { isActive: true };
    let aggregationPipeline = [];

    // Category filter
    if (category) {
      query.categories = category;
    }

    // Rating filter
    if (!isNaN(minRating) && minRating > 0) {
      query["rating.average"] = { $gte: minRating };
    }

    // Geospatial search if coordinates provided
    if (!isNaN(lat) && !isNaN(lng)) {
      aggregationPipeline = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
            },
            distanceField: "distance",
            maxDistance: radius,
            spherical: true,
            query: query
          }
        },
        {
          $sort: { distance: 1, "rating.average": -1 }
        },
        {
          $limit: Math.min(limit, 100)
        }
      ];
    } else if (city) {
      // Fallback to city name search if no coordinates
      query["serviceAreas.areaName"] = { $regex: city, $options: "i" };
      aggregationPipeline = [
        { $match: query },
        { $sort: { "rating.average": -1 } },
        { $limit: Math.min(limit, 100) }
      ];
    } else {
      // No location filter, just basic query
      aggregationPipeline = [
        { $match: query },
        { $sort: { "rating.average": -1 } },
        { $limit: Math.min(limit, 100) }
      ];
    }

    let providers;
    
    if (aggregationPipeline.length > 0) {
      providers = await ServiceProvider.aggregate(aggregationPipeline);
    } else {
      providers = await ServiceProvider.find(query)
        .sort({ "rating.average": -1 })
        .limit(Math.min(limit, 100))
        .lean();
    }

    // Add distance in km for display if geospatial search was used
    if (!isNaN(lat) && !isNaN(lng)) {
      providers = providers.map(provider => ({
        ...provider,
        distanceKm: provider.distance ? Math.round(provider.distance / 1000 * 10) / 10 : null
      }));
    }

    return NextResponse.json({ 
      ok: true, 
      count: providers.length, 
      data: providers,
      searchParams: {
        category,
        minRating,
        city,
        coordinates: !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null,
        radius: radius / 1000 // Return radius in km
      }
    });
  } catch (error) {
    console.error("List providers error:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
