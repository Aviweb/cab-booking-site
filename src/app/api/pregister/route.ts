import { AuthService } from "@/lib/services/AuthService";
import { handleApiRequest, createdResponse } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return handleApiRequest(async () => {
    const body = await req.json();
    const { name, email, password } = body;

    const authService = new AuthService();
    const result = await authService.registerPassenger({
      name,
      email,
      password,
    });

    return createdResponse(
      {
        userId: result.userId,
        name: result.name,
        message: "Passenger registered successfully",
      },
      "Registration successful"
    );
  });
}
