import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModels';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  await connect();
  try {
    const rawBody = await request.text();
    console.log("🧪 Raw body:", rawBody);
    
    const reqBody = JSON.parse(rawBody);
    const { email, password } = reqBody;
    console.log("🧪 Email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const tokenData = { id: user._id, email: user.email, username: user.username };
    console.log("✅ TOKEN_SECRET:", process.env.TOKEN_SECRET); // should not be undefined
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1h" });

    const response = NextResponse.json({ message: "Login successful", success: true });
    response.cookies.set("token", token, { httpOnly: true });

    return response;

  } catch (error: any) {
    console.error("❌ Login API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
