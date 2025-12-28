// app/api/tasks/my/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    console.log(searchParams)
    const agentId = searchParams.get("id");
    const start = searchParams.get("start");       // e.g. "2025-09-01"
    const end = searchParams.get("end");           // e.g. "2025-09-30"
    const completed = searchParams.get("completed"); // "all" | "true" | "false"
    const q = (searchParams.get("q") || "").trim();

    // Must have a valid agent id
    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const filter = {
      assignedTo: new mongoose.Types.ObjectId(agentId), // <-- matches your schema
    };

    // completed filter
    if (completed === "true") filter.completed = true;
    else if (completed === "false") filter.completed = false;

    // date range filter: dueDate OR createdAt in range
    if (start || end) {
      const or = [];
      const dueRange = {};
      const createdRange = {};

      if (start) {
        // start of day UTC
        const s = new Date(`${start}T00:00:00.000Z`);
        dueRange.$gte = s;
        createdRange.$gte = s;
      }
      if (end) {
        // end of day UTC
        const e = new Date(`${end}T23:59:59.999Z`);
        dueRange.$lte = e;
        createdRange.$lte = e;
      }

      if (Object.keys(dueRange).length) or.push({ dueDate: dueRange });
      if (Object.keys(createdRange).length) or.push({ createdAt: createdRange });

      if (or.length) filter.$or = or;
    }

    // text search on title/note
    if (q) {
      filter.$and = (filter.$and || []).concat([
        {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { note: { $regex: q, $options: "i" } },
          ],
        },
      ]);
    }

    // ---- Task.find({ ... }) here ----
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .select("title completed dueDate note relatedCar relatedClient createdAt updatedAt")
      .lean();

    return NextResponse.json({ success: true, tasks }, { status: 200 });
  } catch (e) {
    console.error("[tasks/my] error:", e);
    return NextResponse.json({ success: false, message: "Failed to fetch tasks" }, { status: 500 });
  }
}
