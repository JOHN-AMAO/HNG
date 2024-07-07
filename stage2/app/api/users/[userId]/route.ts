import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const user = await db.user.findUnique({
    where: {
      userId: userId,
    },
  });
  return NextResponse.json({
    status: "Success",
    message: "This route returns user data based on the id provided",
    user,
  });
}
