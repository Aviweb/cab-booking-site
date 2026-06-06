/**
 * Bookings API Route
 * Handles booking CRUD operations with authentication
 */

import { handleApiRequest, createdResponse } from "@/lib/utils/response";
import { NextResponse } from "next/server";
import { ValidationError } from "@/lib/errors";
import { withAuth, withRateLimit, ApiRequest } from "@/lib/middleware/apiAuth";
import { serviceFactory } from "@/lib/factories/ServiceFactory";
import { logger } from "@/lib/services/LoggingService";

// POST handler with authentication and rate limiting
const authenticatedPOST = withAuth(
  withRateLimit(
    async (req: ApiRequest) => {
      return handleApiRequest(async () => {
        const user = req.user!; // Guaranteed by withAuth
        const body = await req.json();
        
        logger.logApiRequest("POST", "/api/bookings", user.userId, { role: user.role });

        const {
          car,
          dateTime,
          startLoc,
          endLoc,
          mobile,
          name,
          driverId,
          driverName,
          status,
        } = body;

        // Use authenticated user's ID instead of trusting request body
        const bookingService = serviceFactory.createBookingService();
        const booking = await bookingService.createBooking({
          car,
          dateTime: new Date(dateTime),
          startLoc,
          endLoc,
          mobile,
          name,
          userId: user.userId, // Use authenticated user ID
          driverId,
          driverName,
          status,
        });

        logger.logBusinessEvent("booking_created", { 
          bookingId: booking.id, 
          userId: user.userId,
          car,
          startLoc,
          endLoc 
        });

        // Send email confirmation
        try {
          const userRepository = serviceFactory.createUserRepository();
          const passenger = await userRepository.findPassengerById(user.userId);

          if (passenger && passenger.email) {
            const emailService = serviceFactory.createEmailService();
            await emailService.sendBookingConfirmation({
              passengerName: name,
              passengerEmail: passenger.email,
              bookingId: booking.id,
              car,
              startLoc,
              endLoc,
              dateTime: new Date(dateTime).toISOString(),
              mobile,
            });
            
            logger.info("Booking confirmation email sent", { 
              bookingId: booking.id, 
              email: passenger.email 
            }, "EMAIL");
          }
        } catch (emailError) {
          logger.error("Failed to send booking confirmation email", { 
            error: (emailError as Error).message,
            bookingId: booking.id 
          }, "EMAIL");
        }

        return createdResponse(
          {
            bookingId: booking.id,
            message: "Booking created successfully",
          },
          "Booking created"
        );
      });
    },
    { maxRequests: 5, windowMs: 60000 } // 5 bookings per minute
  ),
  { roles: ["passenger"] } // Only passengers can create bookings
);

export { authenticatedPOST as POST };

// GET handler with authentication
const authenticatedGET = withAuth(
  async (req: ApiRequest) => {
    try {
      const user = req.user!; // Guaranteed by withAuth
      
      logger.logApiRequest("GET", "/api/bookings", user.userId, { role: user.role });

      const bookingService = serviceFactory.createBookingService();
      
      // Users can only see their own bookings
      const bookings = await bookingService.getBookings(
        user.userId,
        user.role
      );

      logger.info("Bookings fetched", { 
        userId: user.userId, 
        role: user.role, 
        count: bookings.length 
      }, "API");

      return NextResponse.json(
        {
          success: true,
          data: bookings,
          message: "Bookings fetched successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      logger.logApiError("GET", "/api/bookings", error as Error, req.user?.userId);

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
);

export { authenticatedGET as GET };
