/**
 * Validation utilities
 * Implements validation pattern
 */

export class Validator {
  static email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static mobile(mobile: string): boolean {
    const mobileRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ""));
  }

  static password(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/[0-9]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }
    return { valid: true };
  }

  static required(value: unknown, fieldName: string): void {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      throw new Error(`${fieldName} is required`);
    }
  }

  static dateTime(dateTime: string | Date): Date {
    const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    if (date < new Date()) {
      throw new Error("Date cannot be in the past");
    }
    return date;
  }
}
