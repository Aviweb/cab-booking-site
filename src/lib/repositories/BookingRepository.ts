/**
 * Booking Repository
 * Implements Repository Pattern for database operations
 */

import prisma from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export interface CreateBookingData {
  car: string;
  dateTime: Date;
  startLoc: string;
  endLoc: string;
  mobile: string;
  name: string;
  userId: string;
  driverId?: string | null;
  driverName?: string | null;
  status?: string;
}

export interface UpdateBookingData {
  driverId?: string;
  driverName?: string;
  status?: string;
}

export class BookingRepository {
  async create(data: CreateBookingData) {
    return await prisma.bookings.create({
      data: {
        id: crypto.randomUUID(),
        car: data.car,
        dateTime: data.dateTime,
        startLoc: data.startLoc,
        endLoc: data.endLoc,
        mobile: data.mobile,
        name: data.name,
        userId: data.userId,
        driverId: data.driverId || null,
        driverName: data.driverName || null,
        status: data.status || "Pending",
        created_at: new Date(),
      },
    });
  }

  async findById(id: string) {
    const booking = await prisma.bookings.findUnique({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundError("Booking");
    }
    return booking;
  }

  async findByUserId(userId: string) {
    return await prisma.bookings.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
    });
  }

  async findByDriverId(driverId: string) {
    return await prisma.bookings.findMany({
      where: { driverId },
      orderBy: { created_at: "desc" },
    });
  }

  async findPending() {
    return await prisma.bookings.findMany({
      where: { status: "Pending" },
      orderBy: { created_at: "desc" },
    });
  }

  async update(id: string, data: UpdateBookingData) {
    return await prisma.bookings.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async findAll() {
    return await prisma.bookings.findMany({
      orderBy: { created_at: "desc" },
    });
  }
}
