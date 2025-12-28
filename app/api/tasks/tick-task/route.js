// /api/tasks/update-task.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    const { taskId, completed } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    await connectMongoDB();
    const updated = await Task.findByIdAndUpdate(
      taskId,
      { completed },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task: updated });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update task", error: err.message },
      { status: 500 }
    );
  }
}
