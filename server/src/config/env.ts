import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "1h";
export const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://ethio-stock-link-lite.vercel.app";
