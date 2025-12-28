import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import { Employee } from "@/models/Employee";
import { Client } from "@/models/Client";

export async function POST(req) {
  try {
    const {
      title,
      dueDate,
      completed = false,
      relatedCar,
      relatedClient,
      assignedTo,
      createdBy,
      note,
    } = await req.json();
    console.log(relatedClient);

    if (!title || !dueDate || !assignedTo || !createdBy) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(assignedTo) ||
      !mongoose.Types.ObjectId.isValid(createdBy)
    ) {
      return NextResponse.json(
        { message: "Invalid assignedTo or createdBy ID" },
        { status: 400 }
      );
    }

    if (relatedCar && !mongoose.Types.ObjectId.isValid(relatedCar)) {
      return NextResponse.json(
        { message: "Invalid relatedCar ID" },
        { status: 400 }
      );
    }

    if (relatedClient && !mongoose.Types.ObjectId.isValid(relatedClient)) {
      return NextResponse.json(
        { message: "Invalid relatedClient ID" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const newTask = await Task.create({
      title,
      dueDate,
      completed,
      relatedCar,
      relatedClient,
      assignedTo,
      createdBy,
      note,
    });

    // Push task into employee’s task list
    await Employee.findByIdAndUpdate(assignedTo, {
      $push: { tasks: newTask._id },
    });

    // If relatedClient is provided, also push into that client's task list
    if (relatedClient) {
      await Client.findByIdAndUpdate(relatedClient, {
        $push: { tasks: newTask._id },
      });
    }

    return NextResponse.json(
      { message: "Task created and assigned successfully", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create task", error: error.message },
      { status: 500 }
    );
  }
}
