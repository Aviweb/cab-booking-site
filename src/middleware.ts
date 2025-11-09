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
    // Validate token exists and is not empty
    if (!token || token.trim() === "") {
      if (process.env.NODE_ENV === "development") {
        console.log("Middleware - Token is empty or undefined");
      }
      return null;
    }

    const { payload } = await jwtVerify(token, secretKey);

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware - Token verified successfully");
      console.log("Middleware - Payload:", payload);
    }

    return payload;
  } catch (error) {
    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware - JWT verification error:", error);
      console.log("Middleware - Token length:", token?.length || 0);
      console.log(
        "Middleware - Token (first 50 chars):",
        token?.substring(0, 50) || "undefined"
      );
    }
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("token");
  const token = tokenCookie?.value;

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === "development") {
    console.log("Middleware - Token cookie exists:", !!tokenCookie);
    console.log("Middleware - Token value exists:", !!token);
    console.log("Middleware - Token value length:", token?.length || 0);
    console.log("Middleware - Path:", req.nextUrl.pathname);
    console.log(
      "Middleware - All cookies:",
      req.cookies
        .getAll()
        .map((c) => `${c.name}=${c.value?.substring(0, 20)}...`)
    );
  }

  if (!token || token.trim() === "") {
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware - No valid token found, redirecting to login");
    }
    return NextResponse.redirect(new URL("/plogin", req.url));
  }

  const decoded = await verifyJWT(token);

  if (!decoded || !decoded.role) {
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware - Token verification failed or no role");
    }
    return NextResponse.redirect(new URL("/plogin", req.url));
  }

  const role = decoded.role as string;

  if (process.env.NODE_ENV === "development") {
    console.log("Middleware - Role:", role);
  }

  // Check passenger routes
  if (PASSENGER_ROUTES.includes(req.nextUrl.pathname) && role !== "passenger") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Check driver routes
  if (DRIVER_ROUTES.includes(req.nextUrl.pathname) && role !== "driver") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Check shared routes
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
