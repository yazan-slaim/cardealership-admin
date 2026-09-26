import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import { Client } from '@/models/Client';
import { logActivity } from '@/lib/logActivity';
import { getDealershipId } from '@/lib/getDealershipScope';

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
    const dealershipId = await getDealershipId();

    const newClient = await Client.create({
      dealershipId,
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

    logActivity({
      type: "lead_created",
      clientId: newClient._id.toString(),
      metadata: {
        contentPreview: `New lead added — ${fullName || "Unknown"} via ${leadSource || "direct"}`,
      },
      performedBy: assignedAgent || undefined,
      performedByModel: assignedAgent ? "Employee" : undefined,
      source: "employee",
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
