/**
 * Middleware for route protection
 * Implements authentication and authorization pattern
 */

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { env } from "@/lib/env";

const PASSENGER_ROUTES = ["/booking_form"];
const DRIVER_ROUTES = ["/booking_requests"];

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

async function verifyJWT(token: string) {
  try {
    if (!token || token.trim() === "") {
      return null;
    }

    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("token");
  const token = tokenCookie?.value;

  if (!token || token.trim() === "") {
    return NextResponse.redirect(new URL("/plogin", req.url));
  }

  const decoded = await verifyJWT(token);

  if (!decoded || !decoded.role) {
    return NextResponse.redirect(new URL("/plogin", req.url));
  }

  const role = decoded.role as string;

  if (PASSENGER_ROUTES.includes(req.nextUrl.pathname) && role !== "passenger") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (DRIVER_ROUTES.includes(req.nextUrl.pathname) && role !== "driver") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (
    req.nextUrl.pathname === "/my_bookings" &&
    role !== "driver" &&
    role !== "passenger"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/booking_form", "/my_bookings", "/booking_requests"],
};
