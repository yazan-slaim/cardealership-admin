import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Dealership } from "@/models/Dealership";
import { getDealershipId } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectMongoDB();
    
    const dealershipId = await getDealershipId();
    
    if (!dealershipId) {
      return NextResponse.json({ dealership: null });
    }

    const dealership = await Dealership.findById(dealershipId).lean();
    return NextResponse.json({ dealership });

  } catch (error) {
    console.error("GET /api/dealerships/me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealership data" },
      { status: 500 }
    );
  }
}
