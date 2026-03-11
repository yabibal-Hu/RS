// middleware/connectionLimit.ts
import { Request, Response, NextFunction } from "express";

const connections = new Set<string>();
const MAX_CONNECTIONS = 50;

export const connectionLimit = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const connectionId = `${req.ip}-${req.headers["user-agent"]}`;

  if (connections.size >= MAX_CONNECTIONS) {
    console.warn(`Connection limit reached (${connections.size})`);

    // Send 503 Service Unavailable
    return res.status(503).json({
      error: "Server busy, please try again later",
      retryAfter: 30,
    });
  }

  connections.add(connectionId);

  res.on("finish", () => {
    connections.delete(connectionId);
  });

  next();
};
