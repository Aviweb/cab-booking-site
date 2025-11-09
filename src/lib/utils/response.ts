/**
 * API Response utilities
 * Implements consistent response pattern
 */

import { AppError } from "@/lib/errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export function createdResponse<T>(data: T, message?: string): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return new Response(JSON.stringify(response), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(
  error: Error | AppError,
  statusCode?: number
): Response {
  const isAppError = error instanceof AppError;
  const status = statusCode || (isAppError ? error.statusCode : 500);
  const message = isAppError ? error.message : "Internal server error";

  if (!isAppError || !error.isOperational) {
    console.error("Error:", error);
  }

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleApiRequest<T>(
  handler: () => Promise<T>
): Promise<Response> {
  try {
    const result = await handler();
    return successResponse(result);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error);
    }
    return errorResponse(error as Error);
  }
}
