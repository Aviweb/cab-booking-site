/**
 * API Authentication Middleware
 * Implements Decorator Pattern for route protection
 */

import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { env } from "@/lib/env";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

export interface AuthenticatedUser {
  userId: string;
  role: "driver" | "passenger";
}

export interface ApiRequest extends NextRequest {
  user?: AuthenticatedUser;
}

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

/**
 * Decorator pattern for API authentication
 */
export function withAuth(
  handler: (req: ApiRequest) => Promise<Response>,
  options: {
    roles?: ("driver" | "passenger")[];
    optional?: boolean;
  } = {}
) {
  return async (req: ApiRequest): Promise<Response> => {
    try {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        if (options.optional) {
          return handler(req);
        }
        throw new AuthenticationError("Authentication required");
      }

      const { payload } = await jwtVerify(token, secretKey);
      
      if (!payload.userId || !payload.role) {
        throw new AuthenticationError("Invalid token format");
      }

      const user: AuthenticatedUser = {
        userId: payload.userId as string,
        role: payload.role as "driver" | "passenger",
      };

      // Check role permissions if specified
      if (options.roles && !options.roles.includes(user.role)) {
        throw new AuthorizationError(
          `Access denied. Required roles: ${options.roles.join(", ")}`
        );
      }

      req.user = user;
      return handler(req);
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        return Response.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }
      
      return Response.json(
        { success: false, error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

/**
 * Rate limiting decorator (simple implementation)
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  options: {
    maxRequests: number;
    windowMs: number;
  } = { maxRequests: 10, windowMs: 60000 }
) {
  return async (req: NextRequest): Promise<Response> => {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const key = `${ip}:${req.nextUrl.pathname}`;
    
    const limit = rateLimitMap.get(key) || { count: 0, lastReset: now };
    
    // Reset counter if window has passed
    if (now - limit.lastReset > options.windowMs) {
      limit.count = 0;
      limit.lastReset = now;
    }
    
    if (limit.count >= options.maxRequests) {
      return Response.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    
    limit.count++;
    rateLimitMap.set(key, limit);
    
    return handler(req);
  };
}