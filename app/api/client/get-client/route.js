import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import mongoose from "mongoose";
import enquiry from "@/models/Enquiry";
export async function GET(req) {
  try {
    // Step 1: Connect to DB
    await connectMongoDB();
    await Promise.all([
      import("@/models/Employee"),
      import("@/models/Task"),
      import("@/models/Car"),
      import("@/models/Note"),
    ]);

    // Step 2: Extract ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    console.log(id);
    // Step 3: Validate ID existence and format
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Client ID is required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Client ID format" },
        { status: 400 },
      );
    }

    // Step 4: Attempt to fetch client
    let client = null;

    try {
      client = await Client.findById(id);
      console.log(client);
    } catch (err) {
      console.error("[DB ERROR - findById]", err);
      return NextResponse.json(
        {
          success: false,
          message: "Error retrieving client base data",
          error: err.toString(),
        },
        { status: 500 },
      );
    }

    if (!client) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 },
      );
    }

    // Step 5: Populate referenced fields
    try {
      await client.populate({ path: "assignedAgent", select: "fullName" });
    } catch (err) {
      console.error("[POPULATE ERROR] assignedAgent", err);
    }

    try {
      await client.populate({ path: "interestedCars", match: { sold: false } });
    } catch (err) {
      console.error("[POPULATE ERROR] interestedCars", err);
    }
    try {
      await client.populate("files");
    } catch (err) {
      console.error("error in files");
    }
    try {
      await client.populate({
        path: "tasks",
        populate: [
          { path: "assignedTo", select: "fullName" },
          { path: "createdBy", select: "fullName" },
        ],
      });
    } catch (err) {
      console.error("[POPULATE ERROR] tasks with assignedTo/createdBy", err);
    }

    const [enquiryCount, salesCount, revenueData] = await Promise.all([
      Enquiry.countDocuments({ client: objectId }),
      SoldCar.countDocuments({ buyer: objectId }),
      SoldCar.aggregate([
        { $match: { buyer: objectId } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$salePrice" },
          },
        },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    await client.populate("notes");

    return NextResponse.json({ success: true, client }, { status: 200 });
  } catch (error) {
    console.error("[FATAL SERVER ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error occurred",
        error: error.toString(),
      },
      { status: 500 },
    );
  }
}
