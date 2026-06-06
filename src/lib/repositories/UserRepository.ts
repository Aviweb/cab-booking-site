/**
 * User Repository
 * Implements Repository Pattern for database operations
 */

import prisma from "@/lib/prisma";
import { NotFoundError, ConflictError } from "@/lib/errors";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export class UserRepository {
  async findPassengerByEmail(email: string) {
    return await prisma.passengers.findUnique({
      where: { email },
    });
  }

  async findDriverByEmail(email: string) {
    return await prisma.drivers.findUnique({
      where: { email },
    });
  }

  async findPassengerById(id: string) {
    const passenger = await prisma.passengers.findUnique({
      where: { id },
    });
    if (!passenger) {
      throw new NotFoundError("Passenger");
    }
    return passenger;
  }

  async findDriverById(id: string) {
    const driver = await prisma.drivers.findUnique({
      where: { id },
    });
    if (!driver) {
      throw new NotFoundError("Driver");
    }
    return driver;
  }

  async createPassenger(data: CreateUserData) {
    const existing = await this.findPassengerByEmail(data.email);
    if (existing) {
      throw new ConflictError("Passenger with this email already exists");
    }

    return await prisma.passengers.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        password: data.password,
        created_at: new Date(),
      },
    });
  }

  async createDriver(data: CreateUserData) {
    const existing = await this.findDriverByEmail(data.email);
    if (existing) {
      throw new ConflictError("Driver with this email already exists");
    }

    return await prisma.drivers.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        password: data.password,
        created_at: new Date(),
      },
    });
  }
}
