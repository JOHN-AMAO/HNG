import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { organisationId: string } }
) {
  const organisationId = params.organisationId;
  const organisation = await db.organisation.findUnique({
    where: {
      Orgid: organisationId,
    },
  });
  return NextResponse.json({
    status: "Success",
    message: "This route returns organisation data based on the id provided",
    organisation,
  });
}
