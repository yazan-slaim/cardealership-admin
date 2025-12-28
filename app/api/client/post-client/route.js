import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import { Client } from '@/models/Client';
export async function POST(req) {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      preferredContactMethod,
      leadSource,
      interestedCars,
      status,
      assignedAgent,
      files = [] // optional, default to empty array
    } = await req.json();

    await connectMongoDB();

    const newClient = await Client.create({
      fullName,
      email,
      phoneNumber,
      preferredContactMethod,
      leadSource,
      interestedCars,
      status,
      assignedAgent,
      files
    });

    return NextResponse.json(
      { message: 'Client created successfully!', client: newClient },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating client', error: error.message },
      { status: 400 }
    );
  }
}
