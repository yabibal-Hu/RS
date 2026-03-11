// middleware/processMonitor.ts
import { NextFunction, Request, Response } from "express";

interface ProcessInfo {
  pid: number;
  uptime: number;
  memory: number;
  cpu: number;
  connections: number;
  lastActive: Date;
}

// Track active connections
const activeConnections = new Map<string, ProcessInfo>();

export const processMonitor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pid = process.pid;
  const connectionId = `${req.ip}-${Date.now()}`;

  // Track this connection
  activeConnections.set(connectionId, {
    pid,
    uptime: process.uptime(),
    memory: process.memoryUsage().heapUsed,
    cpu: process.cpuUsage().user,
    connections: activeConnections.size,
    lastActive: new Date(),
  });

  // Clean up when response finishes
  res.on("finish", () => {
    activeConnections.delete(connectionId);
  });

  // Auto-kill if too many connections (self-preservation)
  if (activeConnections.size > 50) {
    console.warn(
      `Too many connections (${activeConnections.size}), killing oldest`,
    );
    const oldest = Array.from(activeConnections.entries()).sort(
      (a, b) => a[1].lastActive.getTime() - b[1].lastActive.getTime(),
    )[0];

    if (oldest) {
      activeConnections.delete(oldest[0]);
      // Force close the connection
      try {
        req.destroy();
      } catch (e) {}
    }
  }

  next();
};

// Monitor process health
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  const connectionCount = activeConnections.size;

  console.log(
    `[PROCESS ${process.pid}] Memory: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB, Connections: ${connectionCount}`,
  );

  // Auto-restart if memory too high
  if (memoryUsage.heapUsed > 500 * 1024 * 1024) {
    // 500MB
    console.error(`Memory limit exceeded, restarting process ${process.pid}`);
    process.exit(1);
  }

  // Auto-restart if too many connections
  if (connectionCount > 100) {
    console.error(
      `Too many connections (${connectionCount}), restarting process ${process.pid}`,
    );
    process.exit(1);
  }
}, 60000); // Check every minute
