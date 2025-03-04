import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const response = await req.json();

  // Destructuring name, email, and password from the request body
  const { name, email, password } = response;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  try {
    // Check if a driver already exists with the same name and email
    const existingUser = await prisma.passengers.findFirst({
      where: { name, email },
    });

    // console.log("res", existingUser);

    const existingEmail = await prisma.passengers.findFirst({
      where: { email },
    });

    if (existingUser || existingEmail) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409, // Conflict
      });
    }

    // Hash the password before storing it
    const hashedPassword = await hash(password, 10);

    console.log("hash", hashedPassword);

    // Create a new driver entry in the database
    const newUser = await prisma.passengers.create({
      data: {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        created_at: new Date(),
      },
    });
    console.log("data", newUser);
    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully",
        userId: newUser.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
