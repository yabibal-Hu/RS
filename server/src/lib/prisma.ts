// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// CRITICAL: Add connection pool limits to DATABASE_URL
const databaseUrl = process.env.DATABASE_URL?.includes("?")
  ? process.env.DATABASE_URL +
    "&connection_limit=2&pool_timeout=5&socket_timeout=30"
  : process.env.DATABASE_URL +
    "?connection_limit=2&pool_timeout=5&socket_timeout=30";

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl, // Use modified URL with pool limits
      },
    },
    log: ["error"],
    errorFormat: "minimal",
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Add connection monitoring (optional but helpful)
if (process.env.NODE_ENV === "production") {
  setInterval(async () => {
    try {
      // Check active connections
      const result =
        (await prisma.$queryRaw`SHOW STATUS LIKE 'Threads_connected'`) as Array<{
          Variable_name: string;
          Value: string;
        }>;
      const connections = Number(result[0]?.Value);

      // Log if connections are too high
      if (connections > 5) {
        console.warn(`[Prisma] High connection count: ${connections}`);
      }
    } catch (e) {
      // Silent fail - don't crash app for monitoring
    }
  }, 60000); // Check every minute
}
