/**
 * Booking Update API Route
 * Handles booking status updates (accept, reject, cancel, complete)
 */

import { BookingService } from "@/lib/services/BookingService";
import { handleApiRequest, successResponse } from "@/lib/utils/response";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { env } from "@/lib/env";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleApiRequest(async () => {
    const { id: bookingId } = await params;
    const body = await req.json();
    const { status } = body;

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      throw new Error("Unauthorized");
    }

    // Verify token
    const secretKey = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = payload.userId as string;
    const role = payload.role as string;

    if (!userId || !role) {
      throw new Error("Invalid token");
    }

    const bookingService = new BookingService();

    // Fetch user name from database if needed
    let userName = "Driver";
    if (role === "driver") {
      const { UserRepository } = await import(
        "@/lib/repositories/UserRepository"
      );
      const userRepo = new UserRepository();
      try {
        const driver = await userRepo.findDriverById(userId);
        userName = driver.name;
      } catch {
        // Use default if fetch fails
      }
    }

    // Handle different status updates
    if (status === "Accepted" || status === "Rejected") {
      // Driver accepting/rejecting booking
      if (role !== "driver") {
        throw new Error("Only drivers can accept or reject bookings");
      }
      const updated = await bookingService.updateBookingStatus(
        bookingId,
        userId,
        userName,
        status
      );
      return successResponse(
        updated,
        `Booking ${status.toLowerCase()} successfully`
      );
    }

    if (status === "Cancelled") {
      const updated = await bookingService.cancelBooking(
        bookingId,
        userId,
        role
      );
      return successResponse(updated, "Booking cancelled successfully");
    }

    if (status === "Completed") {
      if (role !== "driver") {
        throw new Error("Only drivers can mark bookings as completed");
      }
      const updated = await bookingService.updateBookingStatus(
        bookingId,
        userId,
        userName,
        "Completed"
      );
      return successResponse(updated, "Booking marked as completed");
    }

    throw new Error("Invalid status");
  });
}
