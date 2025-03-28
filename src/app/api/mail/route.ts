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
    } = response;

    // Validate required fields
    if (!car || !dateTime || !startLoc || !endLoc || !mobile || !name) {
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
  const uuid = searchParams.get("uuid"); // Get the UUID from the query params

  console.log("uuis", uuid);
  try {
    if (!uuid) {
      const bookings = await prisma.bookings.findMany();
      return new Response(JSON.stringify(bookings), { status: 200 });
    } else {
      // Fetch records matching the UUID
      const bookings = await prisma.bookings.findMany({
        where: {
          id: uuid,
        },
      });

      console.log("book", bookings);

      if (bookings.length === 0) {
        return new Response(
          JSON.stringify({
            message: "No entries found for this user",
            data: [],
          }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Data fetched successfully!",
          data: bookings,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
