import { NextRequest, NextResponse } from "next/server";
import IPinfoWrapper, { IPinfo } from "node-ipinfo";
import requestIp from "request-ip";

const ipinfoWrapper = new IPinfoWrapper("95b0bc89ff9156");

export async function GET(req: any) {
  // Get the client's IP address
  // const ip = (await requestIp.getClientIp(req)) || "";
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];

  // Look up the IP information
  const response: IPinfo = await ipinfoWrapper.lookupIp(ip);

  // Get the visitor_name from query parameters
  const url = new URL(req.url);
  const visitorName = url.searchParams.get("visitor_name") || "Visitor";

  // Return the response as JSON
  return NextResponse.json({
    client_ip: response.ip,
    location: response.city,
    greeting: `Hello, ${visitorName}, the temperature is 24.3 degrees in ${response.city}!`,
  });
}
