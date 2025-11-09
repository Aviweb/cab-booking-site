/**
 * Booking Service
 * Implements Service Layer Pattern for business logic
 */

import {
  BookingRepository,
  CreateBookingData,
  UpdateBookingData,
} from "@/lib/repositories/BookingRepository";
import { ValidationError, AuthorizationError } from "@/lib/errors";
import { Validator } from "@/lib/validation";

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data: CreateBookingData) {
    Validator.required(data.car, "Car");
    Validator.required(data.startLoc, "Start location");
    Validator.required(data.endLoc, "End location");
    Validator.required(data.mobile, "Mobile number");
    Validator.required(data.name, "Name");
    Validator.required(data.userId, "User ID");

    if (!Validator.mobile(data.mobile)) {
      throw new ValidationError("Invalid mobile number format");
    }

    const dateTime = Validator.dateTime(data.dateTime);

    if (data.startLoc === data.endLoc) {
      throw new ValidationError("Start and end locations must be different");
    }

    return await this.bookingRepository.create({
      ...data,
      dateTime,
    });
  }

  async getBookings(userId?: string, role?: string) {
    if (!userId || !role) {
      return await this.bookingRepository.findAll();
    }

    if (role === "passenger") {
      return await this.bookingRepository.findByUserId(userId);
    }

    if (role === "driver") {
      return await this.bookingRepository.findByDriverId(userId);
    }

    throw new ValidationError("Invalid role provided");
  }

  async getPendingBookings() {
    return await this.bookingRepository.findPending();
  }

  async updateBookingStatus(
    bookingId: string,
    driverId: string,
    driverName: string,
    status: "Accepted" | "Rejected" | "Completed" | "Cancelled"
  ) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (
      booking.status !== "Pending" &&
      (status === "Accepted" || status === "Rejected")
    ) {
      throw new ValidationError(
        "Only pending bookings can be accepted or rejected"
      );
    }

    if (
      booking.driverId &&
      booking.driverId !== driverId &&
      status !== "Cancelled"
    ) {
      throw new AuthorizationError(
        "You are not authorized to update this booking"
      );
    }

    const updateData: UpdateBookingData = {
      status,
    };

    if (status === "Accepted") {
      updateData.driverId = driverId;
      updateData.driverName = driverName;
    }

    return await this.bookingRepository.update(bookingId, updateData);
  }

  async cancelBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (role === "passenger" && booking.userId !== userId) {
      throw new AuthorizationError("You can only cancel your own bookings");
    }

    if (role === "driver" && booking.driverId !== userId) {
      throw new AuthorizationError(
        "You can only cancel bookings assigned to you"
      );
    }

    if (booking.status === "Completed") {
      throw new ValidationError("Cannot cancel completed bookings");
    }

    return await this.bookingRepository.update(bookingId, {
      status: "Cancelled",
    });
  }
}
