/**
 * Authentication Service
 * Implements Service Layer Pattern for authentication logic
 */

import { compare, hash } from "bcryptjs";
import { SignJWT } from "jose";
import { UserRepository } from "@/lib/repositories/UserRepository";
import { AuthenticationError, ValidationError } from "@/lib/errors";
import { Validator } from "@/lib/validation";
import { env } from "@/lib/env";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  userId: string;
  role: "driver" | "passenger";
  name: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async loginPassenger(credentials: LoginCredentials): Promise<AuthResult> {
    Validator.required(credentials.email, "Email");
    Validator.required(credentials.password, "Password");

    if (!Validator.email(credentials.email)) {
      throw new ValidationError("Invalid email format");
    }

    const passenger = await this.userRepository.findPassengerByEmail(
      credentials.email
    );
    if (!passenger) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isPasswordValid = await compare(
      credentials.password,
      passenger.password
    );
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = await this.generateToken(passenger.id, "passenger");

    return {
      token,
      userId: passenger.id,
      role: "passenger",
      name: passenger.name,
    };
  }

  async loginDriver(credentials: LoginCredentials): Promise<AuthResult> {
    Validator.required(credentials.email, "Email");
    Validator.required(credentials.password, "Password");

    if (!Validator.email(credentials.email)) {
      throw new ValidationError("Invalid email format");
    }

    const driver = await this.userRepository.findDriverByEmail(
      credentials.email
    );
    if (!driver) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isPasswordValid = await compare(
      credentials.password,
      driver.password
    );
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = await this.generateToken(driver.id, "driver");

    return {
      token,
      userId: driver.id,
      role: "driver",
      name: driver.name,
    };
  }

  async registerPassenger(
    data: RegisterData
  ): Promise<{ userId: string; name: string }> {
    Validator.required(data.name, "Name");
    Validator.required(data.email, "Email");
    Validator.required(data.password, "Password");

    if (!Validator.email(data.email)) {
      throw new ValidationError("Invalid email format");
    }

    const passwordValidation = Validator.password(data.password);
    if (!passwordValidation.valid) {
      throw new ValidationError(
        passwordValidation.message || "Invalid password"
      );
    }

    const hashedPassword = await hash(data.password, 10);
    const passenger = await this.userRepository.createPassenger({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      userId: passenger.id,
      name: passenger.name,
    };
  }

  async registerDriver(
    data: RegisterData
  ): Promise<{ userId: string; name: string }> {
    Validator.required(data.name, "Name");
    Validator.required(data.email, "Email");
    Validator.required(data.password, "Password");

    if (!Validator.email(data.email)) {
      throw new ValidationError("Invalid email format");
    }

    const passwordValidation = Validator.password(data.password);
    if (!passwordValidation.valid) {
      throw new ValidationError(
        passwordValidation.message || "Invalid password"
      );
    }

    const hashedPassword = await hash(data.password, 10);
    const driver = await this.userRepository.createDriver({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      userId: driver.id,
      name: driver.name,
    };
  }

  private async generateToken(
    userId: string,
    role: "driver" | "passenger"
  ): Promise<string> {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new SignJWT({ userId, role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
    return token;
  }
}
