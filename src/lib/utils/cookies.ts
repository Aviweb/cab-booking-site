/**
 * Cookie utilities with security best practices
 */

export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const {
    maxAge,
    expires,
    httpOnly = false,
    secure = process.env.NODE_ENV === "production",
    sameSite = "lax",
    path = "/",
  } = options;

  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (maxAge) {
    cookie += `; Max-Age=${maxAge}`;
  }

  if (expires) {
    cookie += `; Expires=${expires.toUTCString()}`;
  }

  if (path) {
    cookie += `; Path=${path}`;
  }

  if (secure) {
    cookie += `; Secure`;
  }

  cookie += `; SameSite=${sameSite}`;

  if (httpOnly) {
    cookie += `; HttpOnly`;
  }

  return cookie;
}

export function deleteCookie(name: string, path: string = "/"): string {
  return `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
