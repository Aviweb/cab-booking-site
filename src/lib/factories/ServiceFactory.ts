/**
 * Service Factory Pattern
 * Centralizes service creation and dependency injection
 */

import { AuthService } from "@/lib/services/AuthService";
import { BookingService } from "@/lib/services/BookingService";
import { EmailService } from "@/lib/services/EmailService";
import { UserRepository } from "@/lib/repositories/UserRepository";
import { BookingRepository } from "@/lib/repositories/BookingRepository";
import { logger } from "@/lib/services/LoggingService";

/**
 * Abstract factory interface
 */
export interface IServiceFactory {
  createAuthService(): AuthService;
  createBookingService(): BookingService;
  createEmailService(): EmailService;
  createUserRepository(): UserRepository;
  createBookingRepository(): BookingRepository;
}

/**
 * Concrete factory implementation
 */
export class ServiceFactory implements IServiceFactory {
  private static instance: ServiceFactory;
  
  // Service instances cache (Singleton pattern for services)
  private authService?: AuthService;
  private bookingService?: BookingService;
  private emailService?: EmailService;
  private userRepository?: UserRepository;
  private bookingRepository?: BookingRepository;

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
      logger.info("ServiceFactory initialized", {}, "FACTORY");
    }
    return ServiceFactory.instance;
  }

  createAuthService(): AuthService {
    if (!this.authService) {
      logger.debug("Creating new AuthService instance", {}, "FACTORY");
      this.authService = new AuthService();
    }
    return this.authService;
  }

  createBookingService(): BookingService {
    if (!this.bookingService) {
      logger.debug("Creating new BookingService instance", {}, "FACTORY");
      this.bookingService = new BookingService();
    }
    return this.bookingService;
  }

  createEmailService(): EmailService {
    if (!this.emailService) {
      logger.debug("Creating new EmailService instance", {}, "FACTORY");
      this.emailService = new EmailService();
    }
    return this.emailService;
  }

  createUserRepository(): UserRepository {
    if (!this.userRepository) {
      logger.debug("Creating new UserRepository instance", {}, "FACTORY");
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  createBookingRepository(): BookingRepository {
    if (!this.bookingRepository) {
      logger.debug("Creating new BookingRepository instance", {}, "FACTORY");
      this.bookingRepository = new BookingRepository();
    }
    return this.bookingRepository;
  }

  // Factory method for creating services by type
  createService<T>(serviceType: string): T {
    switch (serviceType) {
      case "auth":
        return this.createAuthService() as T;
      case "booking":
        return this.createBookingService() as T;
      case "email":
        return this.createEmailService() as T;
      case "userRepository":
        return this.createUserRepository() as T;
      case "bookingRepository":
        return this.createBookingRepository() as T;
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
  }

  // Reset factory state (useful for testing)
  reset(): void {
    logger.info("Resetting ServiceFactory", {}, "FACTORY");
    this.authService = undefined;
    this.bookingService = undefined;
    this.emailService = undefined;
    this.userRepository = undefined;
    this.bookingRepository = undefined;
  }
}

// Export singleton instance
export const serviceFactory = ServiceFactory.getInstance();