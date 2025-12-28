import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { HeatMap } from "@/models/HeatMap";
export async function POST(req) {
  try {
    await connectMongoDB(); // Connect to MongoDB
    const interactions = await req.json();

    if (!Array.isArray(interactions) || interactions.length === 0) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const page = interactions[0].pathname; // Assume all interactions are from the same page
    const batchTimestamp = Date.now();

    await HeatMap.create({ page, interactions, batchTimestamp });

    return NextResponse.json({ message: "Heatmap data stored successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error storing heatmap data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
