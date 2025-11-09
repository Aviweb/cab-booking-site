/**
 * Bookings API Route
 * Handles booking CRUD operations
 */

import { BookingService } from "@/lib/services/BookingService";
import { handleApiRequest, createdResponse } from "@/lib/utils/response";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  return handleApiRequest(async () => {
    const body = await req.json();
    const {
      car,
      dateTime,
      startLoc,
      endLoc,
      mobile,
      name,
      userId,
      driverId,
      driverName,
      status,
    } = body;

    const bookingService = new BookingService();
    const booking = await bookingService.createBooking({
      car,
      dateTime: new Date(dateTime),
      startLoc,
      endLoc,
      mobile,
      name,
      userId,
      driverId,
      driverName,
      status,
    });

    return createdResponse(
      {
        bookingId: booking.id,
        message: "Booking created successfully",
      },
      "Booking created"
    );
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");
    const role = searchParams.get("role");

    const bookingService = new BookingService();
    const bookings = await bookingService.getBookings(
      uuid || undefined,
      role || undefined
    );

    return NextResponse.json(
      {
        success: true,
        data: bookings,
        message: "Bookings fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/bookings - Error:", error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
