import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE,
} from "../config/env";

import ms from "ms";
import { StringValue } from "ms";

/**
 * Signs a JWT access token with the given payload and expiration time.
 * @param payload - The payload to encode in the token.
 * @param expiresIn - Expiration time (default: ACCESS_TOKEN_EXPIRE).
 * @returns Signed JWT token string.
 */
export function signToken(
  payload: object,
  expiresIn: string = ACCESS_TOKEN_EXPIRE
): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ms(expiresIn as StringValue),
  });
}

/**
 * Verifies a JWT access token.
 * @param token - The JWT token string to verify.
 * @returns Decoded token payload if valid.
 */
export function verifyToken(token: string): any {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

/**
 * Signs a JWT refresh token with the given payload and expiration time.
 * @param payload - The payload to encode in the token.
 * @param expiresIn - Expiration time (default: REFRESH_TOKEN_EXPIRE).
 * @returns Signed JWT refresh token string.
 */

/**
 * Generates a JWT token for email verification.
 * @param email - The user's email address.
 * @returns Signed JWT email verification token.
 */

/**
 * Verifies a JWT email verification token.
 * @param token - The JWT token string to verify.
 * @returns Decoded payload with email if valid, otherwise null.
 */
