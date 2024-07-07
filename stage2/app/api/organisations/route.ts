import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define a type that extends NextRequest to include user
interface ExtendedNextRequest extends NextRequest {
  user?: any;
}

export async function GET(request: ExtendedNextRequest) {
  const userId = request.user?.userId;

  if (!userId) {
    return NextResponse.json({
      status: "Unauthorized",
      message: "No user ID found",
      statusCode: 401,
    });
  }

  try {
    const organisations = await db.organisation.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      select: {
        Orgid: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Organisations fetched successfully",
      data: {
        organisations,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching organisations:", error);
    return NextResponse.json({
      status: "Bad request",
      message: "Error fetching organisations",
      statusCode: 400,
    });
  }
}
