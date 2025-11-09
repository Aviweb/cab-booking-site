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
    // Validate required fields
    Validator.required(data.car, "Car");
    Validator.required(data.startLoc, "Start location");
    Validator.required(data.endLoc, "End location");
    Validator.required(data.mobile, "Mobile number");
    Validator.required(data.name, "Name");
    Validator.required(data.userId, "User ID");

    // Validate mobile number
    if (!Validator.mobile(data.mobile)) {
      throw new ValidationError("Invalid mobile number format");
    }

    // Validate date
    const dateTime = Validator.dateTime(data.dateTime);

    // Validate locations are different
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

    // Business logic: Only pending bookings can be accepted/rejected
    if (
      booking.status !== "Pending" &&
      (status === "Accepted" || status === "Rejected")
    ) {
      throw new ValidationError(
        "Only pending bookings can be accepted or rejected"
      );
    }

    // Business logic: Only the assigned driver can update status
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

    // Set driver when accepting
    if (status === "Accepted") {
      updateData.driverId = driverId;
      updateData.driverName = driverName;
    }

    return await this.bookingRepository.update(bookingId, updateData);
  }

  async cancelBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.bookingRepository.findById(bookingId);

    // Business logic: Only passenger or assigned driver can cancel
    if (role === "passenger" && booking.userId !== userId) {
      throw new AuthorizationError("You can only cancel your own bookings");
    }

    if (role === "driver" && booking.driverId !== userId) {
      throw new AuthorizationError(
        "You can only cancel bookings assigned to you"
      );
    }

    // Business logic: Cannot cancel completed bookings
    if (booking.status === "Completed") {
      throw new ValidationError("Cannot cancel completed bookings");
    }

    return await this.bookingRepository.update(bookingId, {
      status: "Cancelled",
    });
  }
}
