/**
 * Environment configuration (Legacy)
 * @deprecated Use ConfigurationService instead for new code
 */

// Re-export from the new configuration service for backward compatibility
export { env, configService } from "@/lib/config/ConfigurationService";

/**
 * @deprecated Use configService.get() instead
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  console.warn(`getEnvVar is deprecated. Use configService.get("${key}") instead`);
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
