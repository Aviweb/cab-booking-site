import { NextRequest, NextResponse } from "next/server";
import { AuthenticationError, ValidationError } from "@/lib/errors";
import { serviceFactory } from "@/lib/factories/ServiceFactory";
import { logger } from "@/lib/services/LoggingService";
import { configService } from "@/lib/config/ConfigurationService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    logger.logApiRequest("POST", "/api/auth/driver/login", undefined, { email });

    const authService = serviceFactory.createAuthService();
    const result = await authService.loginDriver({ email, password });

    logger.logAuthEvent("driver_login", result.userId, { email });

    const nextResponse = NextResponse.json(
      {
        success: true,
        data: {
          userId: result.userId,
          role: result.role,
          name: result.name,
        }, // Don't return token in response
      },
      { status: 200 }
    );

    // Secure cookie options - all cookies are now httpOnly for security
    const cookieOptions = {
      httpOnly: true,
      secure: configService.isProduction,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    };

    if (!result.token || result.token.trim() === "") {
      throw new Error("Token generation failed");
    }

    // Set only the JWT token as httpOnly cookie
    // Client will use /api/user/profile to get user info
    nextResponse.cookies.set("token", result.token, cookieOptions);

    return nextResponse;
  } catch (error) {
    logger.logApiError("POST", "/api/auth/driver/login", error as Error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

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