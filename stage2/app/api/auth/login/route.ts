import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY =
  "D4359C0A55354F6321BA6F0880BAA71E8D65D16BEB9EB76FDA923058B931BD8A";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find the user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        status: "Unauthorized",
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({
        status: "Unauthorized",
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    
    return NextResponse.json({
      status: 200,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      status: "Bad request",
      message: "Login unsuccessful",
      statusCode: 400,
    });
  }
}
