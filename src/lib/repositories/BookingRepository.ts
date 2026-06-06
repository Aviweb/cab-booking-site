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
    // Map car string to CarType enum
    const carTypeMap: Record<string, string> = {
      'Swift': 'SWIFT',
      'Etios': 'ETIOS', 
      'Ertiga': 'ERTIGA',
      'Innova': 'INNOVA',
      'Traveller': 'TRAVELLER'
    };

    // Map status to BookingStatus enum
    const statusMap: Record<string, string> = {
      'Pending': 'PENDING',
      'Accepted': 'ACCEPTED',
      'Rejected': 'REJECTED',
      'Completed': 'COMPLETED',
      'Cancelled': 'CANCELLED'
    };

    return await prisma.bookings.create({
      data: {
        car: carTypeMap[data.car] || 'SWIFT', // Use mapped enum value
        dateTime: data.dateTime,
        startLocation: data.startLoc, // Schema uses startLocation
        endLocation: data.endLoc,     // Schema uses endLocation
        mobile: data.mobile,
        passengerName: data.name,     // Schema uses passengerName
        passengerId: data.userId,     // Schema uses passengerId for passengers
        driverId: data.driverId || null,
        status: statusMap[data.status || 'Pending'] || 'PENDING', // Use mapped enum value
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
      where: { passengerId: userId }, // Use passengerId from schema
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
      where: { status: "PENDING" }, // Use enum value from schema
      orderBy: { created_at: "desc" },
    });
  }

  async update(id: string, data: UpdateBookingData) {
    // Map status to BookingStatus enum if status is provided
    const statusMap: Record<string, string> = {
      'Pending': 'PENDING',
      'Accepted': 'ACCEPTED',
      'Rejected': 'REJECTED',
      'Completed': 'COMPLETED',
      'Cancelled': 'CANCELLED'
    };

    const updateData = { ...data };
    if (updateData.status) {
      updateData.status = statusMap[updateData.status] || updateData.status;
    }

    return await prisma.bookings.update({
      where: { id },
      data: updateData,
    });
  }

  async findAll() {
    return await prisma.bookings.findMany({
      orderBy: { created_at: "desc" },
    });
  }
}
