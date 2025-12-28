import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectMongoDB();

    const tasks = await Task.find({})
      .populate("assignedTo", "fullName") // get agent name
      .sort({ dueDate: 1 })
      .lean();

    return NextResponse.json({ success: true, data: tasks });
  } catch (err) {
    console.error("[GET Tasks]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { id, completed } = await req.json();

    const task = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    return NextResponse.json({ success: true, data: task });
  } catch (err) {
    console.error("[PATCH Task]", err);
    return NextResponse.json(
      { success: false, message: "Failed to update task" },
      { status: 500 }
    );
  }
}
