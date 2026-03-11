// utils/tokenUtils.ts
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  role: "ADMIN" | "USER" | "SUPER_ADMIN" | "WITHDRAW";
  userId: string;
  exp: number;
  iat: number;
  // Add other fields that might be in your token
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getTokenRole = ():
  | "ADMIN"
  | "USER"
  | "SUPER_ADMIN"
  | "WITHDRAW"
  | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const isValidToken = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  return !isTokenExpired(token);
};
