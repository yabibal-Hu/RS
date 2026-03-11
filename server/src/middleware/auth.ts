import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
// import { verifyToken } from "../utils/jwt";

/**
 * Extends the Express Request interface to include userId and role properties,
 * which are set after successful authentication.
 */
export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

/**
 * Middleware to authenticate requests using a JWT token.
 * - Checks for the presence of a Bearer token in the Authorization header.
 * - Verifies the token and attaches userId and role to the request object.
 * - Returns 401 Unauthorized if the token is missing, invalid, or expired.
 */
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: { message: "No token provided", code: "UNAUTHORIZED" } });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    return res.status(401).json({
      error: { message: "Invalid or expired token", code: "UNAUTHORIZED" },
    });
  }
}

/**
 * Middleware to authorize admin-only routes.
 * - Checks if the authenticated user's role is "ADMIN".
 * - Returns 403 Forbidden if the user is not an admin.
 */
export function authorizeAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: { message: "Admin access required", code: "FORBIDDEN" } });
  }
  next();
}
