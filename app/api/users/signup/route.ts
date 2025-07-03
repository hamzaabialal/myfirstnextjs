export const runtime = 'nodejs';

import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModels';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      }
    });
  } catch (error: any) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
