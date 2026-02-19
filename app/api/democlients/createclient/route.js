import { NextResponse } from "next/server";
import { Client } from "@/models/Client";
import { connectMongoDB } from "@/lib/mongodb";
export async function POST(req) {
  await connectMongoDB();
  const body = await req.json();

  const client = await Client.create(body);

  return NextResponse.json(client, { status: 201 });
}
