/**
 * Pending Bookings API Route
 * Returns all pending bookings for drivers
 */

import { BookingService } from "@/lib/services/BookingService";
import { handleApiRequest, successResponse } from "@/lib/utils/response";

export async function GET() {
  return handleApiRequest(async () => {
    const bookingService = new BookingService();
    const bookings = await bookingService.getPendingBookings();

    return successResponse(bookings, "Pending bookings fetched successfully");
  });
}
