import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Client } from "@/models/Client";

export async function GET(req) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") === "asc" ? 1 : -1;

  let query = {};

  if (search) {
    query = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
    };
  }

  const clients = await Client.find(query)
    .sort({ [sort]: order })
    .limit(50);

  return NextResponse.json(clients);
}
