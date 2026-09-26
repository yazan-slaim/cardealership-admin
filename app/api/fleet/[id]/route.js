import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Fleet } from "@/models/Fleet";
import { getDealershipScope } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

/**
 * GET /api/fleet/[id] — Get a single fleet vehicle
 */
export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();

    const vehicle = await Fleet.findOne({ _id: params.id, ...scopeFilter }).lean();
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    return NextResponse.json({ vehicle });
  } catch (err) {
    console.error("GET /api/fleet/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch vehicle." }, { status: 500 });
  }
}

/**
 * PUT /api/fleet/[id] — Update a fleet vehicle
 */
export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const body = await req.json();

    const vehicle = await Fleet.findOneAndUpdate(
      { _id: params.id, ...scopeFilter },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    return NextResponse.json({ vehicle });
  } catch (err) {
    console.error("PUT /api/fleet/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update vehicle." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/fleet/[id] — Soft-delete a fleet vehicle (set isActive to false)
 */
export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();

    const vehicle = await Fleet.findOneAndUpdate(
      { _id: params.id, ...scopeFilter },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Vehicle removed.", vehicle });
  } catch (err) {
    console.error("DELETE /api/fleet/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete vehicle." }, { status: 500 });
  }
}
