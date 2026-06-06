/**
 * Configuration Service with Strategy Pattern
 * Handles different configuration sources and validation strategies
 */

import { logger } from "@/lib/services/LoggingService";

export interface ConfigValidator {
  validate(key: string, value: string | undefined): { isValid: boolean; error?: string };
}

/**
 * Email configuration validator
 */
class EmailConfigValidator implements ConfigValidator {
  validate(key: string, value: string | undefined): { isValid: boolean; error?: string } {
    if (key === "SMTP_HOST" && value && !value.includes(".")) {
      return { isValid: false, error: "SMTP_HOST must be a valid hostname" };
    }
    if (key === "SMTP_PORT" && value) {
      const port = parseInt(value, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        return { isValid: false, error: "SMTP_PORT must be a valid port number (1-65535)" };
      }
    }
    if (key === "SMTP_FROM" && value && !value.includes("@")) {
      return { isValid: false, error: "SMTP_FROM must be a valid email address" };
    }
    return { isValid: true };
  }
}

/**
 * Database configuration validator
 */
class DatabaseConfigValidator implements ConfigValidator {
  validate(key: string, value: string | undefined): { isValid: boolean; error?: string } {
    if (key === "DATABASE_URL" && value) {
      if (!value.startsWith("mysql://") && !value.startsWith("postgresql://") && !value.startsWith("file:")) {
        return { isValid: false, error: `DATABASE_URL must start with mysql:// or postgresql:// and not ${value}` };
      }
    }
    return { isValid: true };
  }
}

/**
 * JWT configuration validator
 */
class JwtConfigValidator implements ConfigValidator {
  validate(key: string, value: string | undefined): { isValid: boolean; error?: string } {
    if (key === "JWT_SECRET" && value) {
      if (value.length < 32) {
        return { isValid: false, error: "JWT_SECRET must be at least 32 characters long" };
      }
    }
    return { isValid: true };
  }
}

/**
 * Configuration entry definition
 */
interface ConfigEntry {
  key: string;
  required: boolean;
  defaultValue?: string;
  validator?: ConfigValidator;
  sensitive?: boolean; // Don't log sensitive values
}

/**
 * Configuration service with validation and multiple strategies
 */
class ConfigurationService {
  private config: Map<string, string> = new Map();
  private validators: Map<string, ConfigValidator> = new Map();
  private static instance: ConfigurationService;

  private readonly configDefinitions: ConfigEntry[] = [
    // Required configurations
    { key: "DATABASE_URL", required: true, validator: new DatabaseConfigValidator(), sensitive: true },
    { key: "JWT_SECRET", required: true, validator: new JwtConfigValidator(), sensitive: true },
    
    // Optional configurations with defaults
    { key: "NODE_ENV", required: false, defaultValue: "development" },
    
    // SMTP configurations (optional for email feature)
    { key: "SMTP_HOST", required: false, validator: new EmailConfigValidator() },
    { key: "SMTP_PORT", required: false, defaultValue: "587", validator: new EmailConfigValidator() },
    { key: "SMTP_USER", required: false, validator: new EmailConfigValidator() },
    { key: "SMTP_PASS", required: false, validator: new EmailConfigValidator(), sensitive: true },
    { key: "SMTP_FROM", required: false, validator: new EmailConfigValidator() },
    { key: "SMTP_SECURE", required: false, defaultValue: "false" },
    
    // App configurations
    { key: "NEXT_PUBLIC_APP_URL", required: false, defaultValue: "http://localhost:3000" },
  ];

  private constructor() {
    this.loadConfiguration();
  }

  static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  private loadConfiguration(): void {
    logger.info("Loading application configuration", {}, "CONFIG");

    const errors: string[] = [];
    let loadedCount = 0;

    for (const definition of this.configDefinitions) {
      const value = process.env[definition.key] || definition.defaultValue;

      // Check if required value is missing
      if (definition.required && !value) {
        errors.push(`Missing required environment variable: ${definition.key}`);
        continue;
      }

      // Validate value if validator is provided
      if (definition.validator && value) {
        const validation = definition.validator.validate(definition.key, value);
        if (!validation.isValid) {
          errors.push(`Invalid ${definition.key}: ${validation.error}`);
          continue;
        }
      }

      if (value) {
        this.config.set(definition.key, value);
        loadedCount++;

        // Log configuration (hide sensitive values)
        const logValue = definition.sensitive ? "***" : value;
        logger.debug(`Loaded config: ${definition.key} = ${logValue}`, {}, "CONFIG");
      }
    }

    if (errors.length > 0) {
      logger.error("Configuration validation failed", { errors }, "CONFIG");
      throw new Error(`Configuration errors: ${errors.join(", ")}`);
    }

    logger.info(`Configuration loaded successfully`, { loadedCount }, "CONFIG");
  }

  get(key: string): string {
    const value = this.config.get(key);
    if (!value) {
      throw new Error(`Configuration key not found: ${key}`);
    }
    return value;
  }

  getOptional(key: string): string | undefined {
    return this.config.get(key);
  }

  getBoolean(key: string): boolean {
    const value = this.get(key);
    return value.toLowerCase() === "true";
  }

  getNumber(key: string): number {
    const value = this.get(key);
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new Error(`Configuration key ${key} is not a valid number: ${value}`);
    }
    return num;
  }

  // Environment helpers
  get isProduction(): boolean {
    return this.get("NODE_ENV") === "production";
  }

  get isDevelopment(): boolean {
    return this.get("NODE_ENV") === "development";
  }

  get isEmailEnabled(): boolean {
    return !!(
      this.getOptional("SMTP_HOST") &&
      this.getOptional("SMTP_USER") &&
      this.getOptional("SMTP_PASS")
    );
  }

  // Get all non-sensitive config for debugging
  getDebugInfo(): Record<string, string> {
    const debug: Record<string, string> = {};
    
    for (const definition of this.configDefinitions) {
      const value = this.config.get(definition.key);
      if (value) {
        debug[definition.key] = definition.sensitive ? "***" : value;
      }
    }
    
    return debug;
  }
}

// Export singleton and create legacy env object for backward compatibility
export const configService = ConfigurationService.getInstance();

// Legacy env object for backward compatibility
export const env = {
  get DATABASE_URL() { return configService.get("DATABASE_URL"); },
  get JWT_SECRET() { return configService.get("JWT_SECRET"); },
  get NODE_ENV() { return configService.get("NODE_ENV"); },
  get IS_PRODUCTION() { return configService.isProduction; },
  get IS_DEVELOPMENT() { return configService.isDevelopment; },
  
  // SMTP configuration
  get SMTP_HOST() { return configService.getOptional("SMTP_HOST"); },
  get SMTP_PORT() { return configService.getOptional("SMTP_PORT") || "587"; },
  get SMTP_USER() { return configService.getOptional("SMTP_USER"); },
  get SMTP_PASS() { return configService.getOptional("SMTP_PASS"); },
  get SMTP_FROM() { return configService.getOptional("SMTP_FROM"); },
  get SMTP_SECURE() { return configService.getBoolean("SMTP_SECURE"); },
} as const;