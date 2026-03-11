// app/api/system/route.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const systemController = {
  // ✅ get site settings - GOOD (single query)
  getSetting: async (req: Request, res: Response) => {
    try {
      const siteSettings = await prisma.setting.findFirst();
      if (!siteSettings) {
        return res.status(404).json({ error: "Site settings not found" });
      }
      console.log("rer", res.json(siteSettings));
      return res.json(siteSettings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ get banks - FIXED: Use transaction to combine 2-3 queries into 1 connection
  getBanks: async (req: AuthRequest, res: Response) => {
    try {
      const type = new URL(req.url, `${process.env.API_URL}`).searchParams.get(
        "type",
      );
      const userId = req.userId;

      let whereClause = {};
      let limit = {};

      switch (type) {
        case "DEPOSIT":
          whereClause = { status: { in: ["DEPOSIT", "BOTH"] } };
          limit = {
            maxDeposit: true,
            minDeposit: true,
            dallyDepositLimit: true,
          };
          break;
        case "WITHDRAW":
          whereClause = { status: { in: ["WITHDRAW", "BOTH"] } };
          limit = {
            maxWithdraw: true,
            minWithdraw: true,
            dallyWithdrawLimit: true,
            withdrawFee: true,
          };
          break;
        default:
          whereClause = {};
          limit = {
            maxDeposit: true,
            minDeposit: true,
            dallyDepositLimit: true,
            maxWithdraw: true,
            minWithdraw: true,
            dallyWithdrawLimit: true,
            withdrawFee: true,
          };
          break;
      }

      // BEFORE: 2-3 separate queries = 2-3 connections
      // AFTER: 1 transaction with Promise.all = 1 connection
      const result = await prisma.$transaction(async (tx) => {
        const [banks, siteSettings, userBalance] = await Promise.all([
          tx.bank.findMany({ where: whereClause }),
          tx.setting.findFirst({ select: limit }),
          userId
            ? tx.profile.findUnique({
                where: { userId },
                select: {
                  currentBalance: true,
                  vipName: true,
                  fundIncome: true,
                },
              })
            : Promise.resolve(null),
        ]);

        return { banks, siteSettings, userBalance };
      });

      return res.json({
        ...result,
        success: true,
      });
    } catch (err) {
      console.error("Bank Get Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ vipLevels - FIXED: Add validation and proper response
  vipLevels: async (req: Request, res: Response) => {
    try {
      const body = req.body;

      // Basic validation
      if (!body.name || !body.price) {
        return res.status(400).json({
          error: "Name and price are required",
        });
      }

      const vip = await prisma.vip.create({
        data: body,
        select: {
          id: true,
          name: true,
          price: true,
          dailyIncome: true,
          incomePerTask: true,
          commission: true,
        },
      });

      return res.status(201).json({
        message: "VIP created successfully",
        vip,
        success: true,
      });
    } catch (err) {
      console.error("VIP Create Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ getVip - FIXED: Use transaction to combine 2 queries into 1 connection
  getVip: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;

      // BEFORE: 2 separate queries = 2 connections
      // AFTER: 1 transaction with Promise.all = 1 connection
      const result = await prisma.$transaction(async (tx) => {
        const [vips, userVip] = await Promise.all([
          tx.vip.findMany({
            orderBy: { price: "asc" },
            select: {
              id: true,
              name: true,
              price: true,
              dailyIncome: true,
              incomePerTask: true,
              commission: true,
              description: true,
              logoDir: true,
              dailyTask: true,
            },
          }),
          userId
            ? tx.user.findUnique({
                where: { id: userId },
                select: {
                  profile: {
                    select: {
                      vipName: true,
                      currentBalance: true,
                    },
                  },
                },
              })
            : Promise.resolve(null),
        ]);

        return { vips, userVip };
      });

      return res.json({
        ...result,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ getTaskInfo - GOOD (single query)
  getTaskInfo: async (req: Request, res: Response) => {
    try {
      const taskInfo = await prisma.taskInfo.findMany({
        orderBy: { taskId: "asc" },
        select: {
          id: true,
          taskId: true,
          taskName: true,
          description: true,
          incomePerTask: true,
          logoDir: true,
        },
      });
      return res.json({ success: true, data: taskInfo });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
