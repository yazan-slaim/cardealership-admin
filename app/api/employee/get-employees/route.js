import { NextResponse } from 'next/server';
import { Employee } from '@/models/Employee';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET() {
  await connectMongoDB();
  const agents = await Employee.find({}, '_id fullName').lean();

  return NextResponse.json({
    success: true,
    agents,
  });
}
