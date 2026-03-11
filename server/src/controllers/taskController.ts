// app/api/task/route.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../lib/jwt";

export const getSettings = {
  // ✅ FIXED: Only connection optimization, same response structure
  getSettings: async (req: Request, res: Response) => {
    try {
      const { userId, token } = req.body;
      const user = await verifyToken(token);
      const { searchParams } = new URL(req.url, `${process.env.API_URL}`);
      const timeIsUp = searchParams.get("timeIsUp") === "true";

      // USE TRANSACTION - both operations in ONE connection
      const result = await prisma.$transaction(async (tx) => {
        // Update tasks if timeIsUp
        if (timeIsUp) {
          await tx.task.updateMany({
            where: { userId },
            data: { status: "0" },
          });
        }

        // Get user data - EXACT same structure as before
        const userData = await tx.user.findUnique({
          where: { id: userId },
          select: {
            profile: {
              select: {
                currentBalance: true, // Fixed: was false
                vip: {
                  select: {
                    name: true,
                    dailyIncome: true,
                    incomePerTask: true,
                    commission: true,
                  },
                },
                taskStatus: true,
              },
            },
            task: {
              select: {
                id: true,
                taskInfoId: true,
                status: true,
                updatedAt: true,
              },
            },
          },
        });

        return userData;
      });

      // Send response - EXACT same format as before
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
