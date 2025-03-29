import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const response = await req.json();

  // Destructuring the email and password from the request body
  const { email, password } = response;

  // Check if both email and password are provided
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  // Look up the user by email in the database
  const user = await prisma?.passengers?.findUnique({ where: { email } });

  // If user is not found, return an error
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await compare(password, user.password);

  // If password is invalid, return an error
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  // Create a JWT token with the user's id and role
  const token = jwt.sign(
    { userId: user.id, role: "passenger" },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // Token expires in 1 hour
    }
  );

  // Return the success response along with the token
  return new Response(
    JSON.stringify({
      success: true,
      token,
      userId: user.id,
      role: "passenger",
    }),
    {
      status: 200,
    }
  );
}
