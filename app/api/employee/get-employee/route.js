import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Employee } from "@/models/Employee";
import "@/models/Task";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { success: false, message: "Employee ID is required" },
        { status: 400 }
      );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Employee ID format" },
        { status: 400 }
      );
    }

    const employeeDoc = await Employee.findById(id);
    if (!employeeDoc) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 }
      );
    }

  //  await employeeDoc.populate({ path: "tasks" });
    const employee = employeeDoc.toObject();

    // 👇 log tasks here
    console.log("[get-employee] tasks:", employee.tasks);

    return NextResponse.json({ success: true, employee }, { status: 200 });
  } catch (error) {
    console.error("[get-employee] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching employee",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
