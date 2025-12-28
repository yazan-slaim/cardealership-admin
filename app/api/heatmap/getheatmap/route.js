import { NextResponse } from "next/server";
import { HeatMap } from "@/models/HeatMap";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectMongoDB();

    // Extract the 'page' query parameter
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    console.log(page)

    if (!page) {
      return NextResponse.json({ error: "Page parameter is required" }, { status: 400 });
    }

    // Fetch only documents for the specific page
    const heatmapData = await HeatMap.find({ page }, "interactions -_id").lean();

    // Flatten interactions
    const flattenedInteractions = heatmapData.flatMap(doc => 
      doc.interactions.map(({ x, y, type }) => ({ x, y, type }))
    );
    console.log(flattenedInteractions)

    return NextResponse.json(flattenedInteractions, { status: 200 });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
