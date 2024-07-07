import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY =
  "D4359C0A55354F6321BA6F0880BAA71E8D65D16BEB9EB76FDA923058B931BD8A";

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(
      JSON.stringify({
        status: "Unauthorized",
        message: "No token provided",
        statusCode: 401,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (request as any).user = decoded; // Attach the decoded user information to the request object
    return NextResponse.next();
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        status: "Unauthorized",
        message: "Invalid token",
        statusCode: 401,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}

export function middleware(request: NextRequest) {
  return verifyToken(request);
}

export const config = {
  matcher: "/api/organisations", // Protect the organisations endpoint
};
