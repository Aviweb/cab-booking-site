// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const PASSENGER_ROUTES = ["/booking_form", "my_bookings"];
// const DRIVER_ROUTES = ["booking_requests", "my_bookings"];

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   console.log("token found", token);

//   if (!token) {
//     return NextResponse.redirect(new URL("/plogin", req.url));
//   }

//   try {
//     console.log("decoded");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       role: string;
//     };
//     console.log("decoded", decoded);

//     if (
//       PASSENGER_ROUTES.includes(req.nextUrl.pathname) &&
//       decoded.role !== "passenger"
//     ) {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     if (
//       DRIVER_ROUTES.includes(req.nextUrl.pathname) &&
//       decoded.role !== "driver"
//     ) {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     return NextResponse.next();

//     // Allow access
//   } catch (error) {
//     console.log("error here", error);

//     return NextResponse.redirect(new URL("/plogin", req.url));
//   }
// }

// export const config = {
//   matcher: ["/booking_form", "/my_bookings", "/booking_requests"], // Protect the necessary routes
// };

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Use jose for Edge compatibility

const PASSENGER_ROUTES = ["/booking_form"];
const DRIVER_ROUTES = ["/booking_requests"];

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET as string);

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.log("error", error);

    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log("token found", token);

  if (!token) {
    return NextResponse.redirect(new URL("/plogin", req.url));
  }

  const decoded = await verifyJWT(token);

  if (!decoded || !decoded.role) {
    return NextResponse.redirect(new URL("/plogin", req.url));
  }

  if (
    PASSENGER_ROUTES.includes(req.nextUrl.pathname) &&
    decoded.role !== "passenger"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (
    DRIVER_ROUTES.includes(req.nextUrl.pathname) &&
    decoded.role !== "driver"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (
    req.nextUrl.pathname === "/my_bookings" &&
    decoded.role !== "driver" &&
    decoded.role !== "passenger"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next(); // Allow access
}

export const config = {
  matcher: ["/booking_form", "/my_bookings", "/booking_requests"], // Protect the necessary routes
};
