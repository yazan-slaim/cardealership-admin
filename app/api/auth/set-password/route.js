import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectMongoDB } from '@/lib/mongodb';
import { Employee } from '@/models/Employee';

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    await connectMongoDB();

    // Find employee by token and ensure token is not expired
    const employee = await Employee.findOne({
      inviteToken: token,
      inviteTokenExpires: { $gt: new Date() }
    });

    if (!employee) {
      return NextResponse.json({ error: 'Invalid or expired token. Please request a new invite.' }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update the employee record
    employee.passwordHash = passwordHash;
    employee.isActive = true;
    employee.inviteToken = null;
    employee.inviteTokenExpires = null;
    await employee.save();

    return NextResponse.json({ success: true, message: 'Password set successfully. You can now log in.' });

  } catch (error) {
    console.error('Set Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
