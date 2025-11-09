import { AuthService } from "@/lib/services/AuthService";
import { NextRequest, NextResponse } from "next/server";
import { AuthenticationError, ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const authService = new AuthService();
    const result = await authService.loginPassenger({ email, password });

    const nextResponse = NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    };

    if (!result.token || result.token.trim() === "") {
      throw new Error("Token generation failed");
    }

    nextResponse.cookies.set("token", result.token, cookieOptions);
    nextResponse.cookies.set("uuid", result.userId, {
      ...cookieOptions,
      httpOnly: false,
    });
    nextResponse.cookies.set("role", result.role, {
      ...cookieOptions,
      httpOnly: false,
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
