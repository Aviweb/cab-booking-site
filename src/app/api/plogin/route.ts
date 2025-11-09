import { AuthService } from "@/lib/services/AuthService";
import { NextRequest, NextResponse } from "next/server";
import { AuthenticationError, ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const authService = new AuthService();
    const result = await authService.loginPassenger({ email, password });

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("Login - Token generated:", !!result.token);
      console.log("Login - Token length:", result.token?.length || 0);
      console.log(
        "Login - Token (first 50 chars):",
        result.token?.substring(0, 50)
      );
    }

    // Set secure cookies using NextResponse for proper cookie handling
    const nextResponse = NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

    // Set cookies with proper attributes
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    };

    // Verify token exists before setting cookie
    if (!result.token || result.token.trim() === "") {
      console.error("Login - ERROR: Token is empty!");
      throw new Error("Token generation failed");
    }

    nextResponse.cookies.set("token", result.token, cookieOptions);

    // Debug: Verify cookie was set
    if (process.env.NODE_ENV === "development") {
      const setCookie = nextResponse.cookies.get("token");
      console.log("Login - Cookie set:", !!setCookie);
      console.log(
        "Login - Cookie value length:",
        setCookie?.value?.length || 0
      );
    }
    nextResponse.cookies.set("uuid", result.userId, {
      ...cookieOptions,
      httpOnly: false, // uuid can be accessed client-side if needed
    });
    nextResponse.cookies.set("role", result.role, {
      ...cookieOptions,
      httpOnly: false, // role can be accessed client-side if needed
    });

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);

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
