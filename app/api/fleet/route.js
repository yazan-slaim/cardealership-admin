import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Fleet } from "@/models/Fleet";
import { getDealershipScope, getDealershipId } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

/**
 * GET /api/fleet — List all fleet vehicles for the current dealership
 * Supports query params: ?status=available&bodyType=SUV&search=camry
 */
export async function GET(req) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const { searchParams } = new URL(req.url);

    const filter = { ...scopeFilter, isActive: true };

    // Optional status filter
    const status = searchParams.get("status");
    if (status) filter.status = status;

    // Optional bodyType filter
    const bodyType = searchParams.get("bodyType");
    if (bodyType) filter.bodyType = bodyType;

    // Optional search
    const search = searchParams.get("search");
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { carMake: regex },
        { model: regex },
        { licensePlate: regex },
        { vinNumber: regex },
      ];
    }

    const sortField = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") === "asc" ? 1 : -1;

    const fleet = await Fleet.find(filter)
      .sort({ [sortField]: sortOrder })
      .lean();

    return NextResponse.json({ fleet }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("GET /api/fleet error:", err);
    return NextResponse.json({ error: "Failed to fetch fleet." }, { status: 500 });
  }
}

/**
 * POST /api/fleet — Add a new vehicle to the fleet
 */
export async function POST(req) {
  try {
    await connectMongoDB();
    const dealershipId = await getDealershipId();
    if (!dealershipId) {
      return NextResponse.json({ error: "No dealership context." }, { status: 403 });
    }

    const body = await req.json();

    const vehicle = await Fleet.create({
      ...body,
      dealershipId,
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (err) {
    console.error("POST /api/fleet error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create fleet vehicle." },
      { status: 500 }
    );
  }
}
