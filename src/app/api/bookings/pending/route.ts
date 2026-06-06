/**
 * Pending Bookings API Route
 * Returns all pending bookings for authenticated drivers only
 */

import { handleApiRequest, successResponse } from "@/lib/utils/response";
import { withAuth, ApiRequest } from "@/lib/middleware/apiAuth";
import { serviceFactory } from "@/lib/factories/ServiceFactory";
import { logger } from "@/lib/services/LoggingService";

// GET handler with authentication - only drivers can access
const authenticatedGET = withAuth(
  async (req: ApiRequest) => {
    return handleApiRequest(async () => {
      const user = req.user!; // Guaranteed by withAuth
      
      logger.logApiRequest("GET", "/api/bookings/pending", user.userId, { role: user.role });

      const bookingService = serviceFactory.createBookingService();
      const bookings = await bookingService.getPendingBookings();

      logger.info("Pending bookings fetched", { 
        driverId: user.userId, 
        count: bookings.length 
      }, "API");

      return successResponse(bookings, "Pending bookings fetched successfully");
    });
  },
  { roles: ["driver"] } // Only drivers can see pending bookings
);

export { authenticatedGET as GET };
