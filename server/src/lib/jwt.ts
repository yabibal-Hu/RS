// lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret";


export function signToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
