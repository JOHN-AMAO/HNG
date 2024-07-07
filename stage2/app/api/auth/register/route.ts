import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY =
  "D4359C0A55354F6321BA6F0880BAA71E8D65D16BEB9EB76FDA923058B931BD8A";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone } = body;

    // Check if the email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        status: "Bad request",
        message: "Email already in use",
        statusCode: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        organisations: {
          create: {
            name: `${firstName}'s Organisation`,
          },
        },
      },
      include: {
        organisations: true,
      },
    });
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      status: "success",
      statusCode: 201,
      message: "Registration successful",
      data: {
        accessToken: token,
        user: user,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
}
