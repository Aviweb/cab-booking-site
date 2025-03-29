import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const response = await req.json();
    const {
      car,
      dateTime,
      startLoc,
      endLoc,
      mobile,
      name,
      driverId,
      driverName,
      status,
      userId,
    } = response;

    // Validate required fields
    if (
      !car ||
      !dateTime ||
      !startLoc ||
      !endLoc ||
      !mobile ||
      !name ||
      !userId
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Create booking entry in the database
    const newBooking = await prisma.bookings.create({
      data: {
        id: uuidv4(),
        car,
        dateTime: new Date(dateTime),
        startLoc,
        endLoc,
        mobile,
        name,
        driverId: driverId || null,
        driverName: driverName || null,
        userId: userId || null,
        status: status || "Pending",
        created_at: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ success: true, bookingId: newBooking.id }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get("uuid");
  const role = searchParams.get("role");

  console.log("UUID:", uuid, "Role:", role);

  try {
    let bookings;

    if (!uuid || !role) {
      // Fetch all bookings if uuid or role is missing
      bookings = await prisma.bookings.findMany();
    } else if (role === "driver") {
      // Fetch bookings for the driver
      bookings = await prisma.bookings.findMany({
        where: { driverId: uuid },
      });
    } else if (role === "passenger") {
      // Fetch bookings for the passenger
      bookings = await prisma.bookings.findMany({
        where: { userId: uuid },
      });
    } else {
      return new Response(
        JSON.stringify({ message: "Invalid role provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ message: "No entries found", data: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Data fetched successfully!", data: bookings }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
