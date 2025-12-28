import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import { Employee } from '@/models/Employee';

export const runtime = 'nodejs';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    name,
    email,
    password,
    confirmPassword,
    phoneNumber = '',
    address = '',
    profileImageUrl = '',
    role, // we’ll sanitize this below
  } = body ?? {};

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val || '');

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ message: 'Invalid email format' }, { status: 422 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ message: 'Passwords do not match' }, { status: 422 });
  }
  if (password.length < 6) {
    return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 422 });
  }

  try {
    await connectMongoDB();

    const existing = await Employee.findOne({ email: email.toLowerCase().trim() }).lean();
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Security: force role to "agent" on public signup
    // If you want to allow choosing role, you must guard it (e.g., only admins can set role).
    const allowedRoles = new Set(["admin", "manager", "agent", "inventory", "marketing", "viewer"]);
    const sanitizedRole = allowedRoles.has((role || '').toLowerCase())
      ? (role || '').toLowerCase()
      : 'agent';

    const doc = await Employee.create({
      email: email.toLowerCase().trim(),
      fullName: name.trim(),
      passwordHash,
      phoneNumber: phoneNumber?.trim() || undefined,
      address: address?.trim() || undefined,
      profileImageUrl: profileImageUrl?.trim() || undefined,

      // server-authoritative role: default to agent for safety
      role: 'agent', // or use sanitizedRole if you intentionally allow role from signup
      // the rest use schema defaults:
      // isActive: true,
      // hireDate: Date.now(),
      // totalSalesCount: 0,
      // totalRevenueGenerated: 0,
      // tasks: [],
    });

    return NextResponse.json(
      {
        message: 'User created',
        id: doc._id,
        email: doc.email,
        fullName: doc.fullName,
        role: doc.role,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err && err.code === 11000) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }
    if (err?.name === 'ValidationError') {
      return NextResponse.json({ message: 'Invalid data', details: err.message }, { status: 422 });
    }
    console.error('User creation failed:', err);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
