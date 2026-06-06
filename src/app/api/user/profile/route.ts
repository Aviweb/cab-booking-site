/**
 * User Profile API Route
 * Provides user information securely via JWT token
 * Replaces client-side cookie reading for security
 */

import { NextRequest } from "next/server";
import { successResponse } from "@/lib/utils/response";
import { withAuth, ApiRequest } from "@/lib/middleware/apiAuth";
import { serviceFactory } from "@/lib/factories/ServiceFactory";
import { logger } from "@/lib/services/LoggingService";

interface UserProfile {
  userId: string;
  role: "driver" | "passenger";
  name: string;
  email: string;
}

// GET handler with authentication
const authenticatedGET = withAuth(
  async (req: ApiRequest) => {
    const user = req.user!; // Guaranteed by withAuth
    
    logger.logApiRequest("GET", "/api/user/profile", user.userId, { role: user.role });

    try {
      const userRepository = serviceFactory.createUserRepository();
      
      let userData;
      if (user.role === "passenger") {
        userData = await userRepository.findPassengerById(user.userId);
      } else {
        userData = await userRepository.findDriverById(user.userId);
      }

      if (!userData) {
        return Response.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      const profile: UserProfile = {
        userId: user.userId,
        role: user.role,
        name: userData.name,
        email: userData.email,
      };

      logger.info("User profile fetched", { userId: user.userId, role: user.role }, "API");

      return successResponse(profile, "Profile fetched successfully");
    } catch (error) {
      logger.logApiError("GET", "/api/user/profile", error as Error, user.userId);
      
      return Response.json(
        { success: false, error: "Failed to fetch profile" },
        { status: 500 }
      );
    }
  }
);

export { authenticatedGET as GET };