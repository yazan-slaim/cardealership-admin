import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Employee } from "@/models/Employee";

export async function POST(req) {

  try {
    const {
        fullName,
      email,
      phoneNumber,
      passwordHash,
      address,
      profileImageUrl,
      hireDate,
    } = await req.json();

    console.log("Creating Agent:", fullName);
    await connectMongoDB();

    const newAgent = await Employee.create({
      fullName,
      email,
      phoneNumber,
      passwordHash,
      address,
      profileImageUrl,
      hireDate,
    });

    return NextResponse.json(
      { message: "Sales agent created successfully!", agent: newAgent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating sales agent", error: error.message },
      { status: 400 }
    );
  }
}
