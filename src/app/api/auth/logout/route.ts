import { NextResponse } from "next/server";
import { logger } from "@/lib/services/LoggingService";
import { configService } from "@/lib/config/ConfigurationService";

export async function POST() {
  try {
    logger.logApiRequest("POST", "/api/auth/logout");

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the httpOnly token cookie
    const cookieOptions = {
      httpOnly: true,
      secure: configService.isProduction,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0, // Expire immediately
    };

    response.cookies.set("token", "", cookieOptions);

    logger.logAuthEvent("logout", undefined, {});

    return response;
  } catch (error) {
    logger.logApiError("POST", "/api/auth/logout", error as Error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}