import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import fs from "fs";
import path from "path";

// Bank CRUD Operations
export const bankController = {
  // Get all banks - GOOD (single query)
  getAllBanks: async (req: Request, res: Response) => {
    try {
      const banks = await prisma.bank.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          bankName: true,
          accNumber: true,
          owner: true,
          status: true,
          logo: true,
        },
      });
      return res.json({ success: true, data: banks });
    } catch (error) {
      console.error("Error fetching banks:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Create bank - GOOD (single query)
  createBank: async (req: Request, res: Response) => {
    try {
      const { bankName, accNumber, owner, status } = req.body;

      let logo: string | null = null;
      const files: any = req.files;
      if (Array.isArray(files)) {
        if (files.length > 0) {
          logo = `${files[0].filename}`;
        }
      } else if (files && typeof files === "object") {
        const logoFiles = files.logo as any[] | undefined;
        if (logoFiles && logoFiles.length > 0) {
          logo = `${logoFiles[0].filename}`;
        }
      }

      const bank = await prisma.bank.create({
        data: {
          bankName,
          accNumber,
          owner,
          status,
          logo: logo ?? "",
        },
        select: {
          id: true,
          bankName: true,
          accNumber: true,
          owner: true,
          status: true,
          logo: true,
        },
      });

      return res.json({
        success: true,
        data: { ...bank, logoUrl: logo ? `/uploads/system${logo}` : null },
      });
    } catch (error) {
      console.error("Error creating bank:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Update bank - GOOD (single query)
  updateBank: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { bankName, accNumber, owner, status } = req.body;

      let logo: string | null = null;
      const files: any = req.files;
      if (Array.isArray(files)) {
        if (files.length > 0) {
          logo = `${files[0].filename}`;
        }
      } else if (files && typeof files === "object") {
        const logoFiles = files.logo as any[] | undefined;
        if (logoFiles && logoFiles.length > 0) {
          logo = `${logoFiles[0].filename}`;
        }
      }

      const bank = await prisma.bank.update({
        where: { id: parseInt(id) },
        data: { bankName, accNumber, owner, status, ...(logo && { logo }) },
        select: {
          id: true,
          bankName: true,
          accNumber: true,
          owner: true,
          status: true,
          logo: true,
        },
      });

      return res.json({ success: true, data: bank });
    } catch (error) {
      console.error("Error updating bank:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Delete bank - GOOD (single query)
  deleteBank: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.bank.delete({
        where: { id: parseInt(id) },
      });

      return res.json({ success: true, message: "Bank deleted successfully" });
    } catch (error) {
      console.error("Error deleting bank:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
};

// Settings CRUD Operations
export const settingController = {
  // Get settings - GOOD (single query)
  getSettings: async (req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findFirst({
        select: {
          id: true,
          commission: true,
          commission2: true,
          commission3: true,
          minWithdraw: true,
          maxWithdraw: true,
          withdrawFee: true,
          dallyDepositLimit: true,
          dallyWithdrawLimit: true,
          maxDeposit: true,
          minDeposit: true,
          dallyDepositLimitAmount: true,
          dallyWithdrawLimitAmount: true,
        },
      });
      return res.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error fetching settings:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Update settings - FIXED: Use transaction to combine check and update
  updateSettings: async (req: Request, res: Response) => {
    try {
      const {
        commission,
        minWithdraw,
        maxWithdraw,
        withdrawFee,
        dallyDepositLimit,
        dallyWithdrawLimit,
        maxDeposit,
        minDeposit,
        dallyDepositLimitAmount,
        dallyWithdrawLimitAmount,
      } = req.body;

      // BEFORE: Check then update = 2 connections
      // AFTER: Transaction with upsert = 1 connection
      const settings = await prisma.$transaction(async (tx) => {
        const existingSettings = await tx.setting.findFirst({
          select: {
            id: true,
            commission: true,
            minWithdraw: true,
            maxWithdraw: true,
            withdrawFee: true,
            dallyDepositLimit: true,
            dallyWithdrawLimit: true,
            maxDeposit: true,
            minDeposit: true,
            dallyDepositLimitAmount: true,
            dallyWithdrawLimitAmount: true,
          },
        });

        if (existingSettings?.id) {
          // Update existing
          return await tx.setting.update({
            where: { id: existingSettings.id },
            data: {
              commission: commission ?? existingSettings.commission ?? "",
              minWithdraw: minWithdraw ?? existingSettings.minWithdraw ?? 0,
              maxWithdraw: maxWithdraw ?? existingSettings.maxWithdraw ?? 0,
              withdrawFee: withdrawFee ?? existingSettings.withdrawFee ?? "0",
              dallyDepositLimit:
                dallyDepositLimit ?? existingSettings.dallyDepositLimit ?? 0,
              dallyWithdrawLimit:
                dallyWithdrawLimit ?? existingSettings.dallyWithdrawLimit ?? 0,
              maxDeposit: maxDeposit ?? existingSettings.maxDeposit ?? 0,
              minDeposit: minDeposit ?? existingSettings.minDeposit ?? 0,
              dallyDepositLimitAmount:
                dallyDepositLimitAmount ??
                existingSettings.dallyDepositLimitAmount ??
                0,
              dallyWithdrawLimitAmount:
                dallyWithdrawLimitAmount ??
                existingSettings.dallyWithdrawLimitAmount ??
                0,
            },
            select: {
              id: true,
              commission: true,
              minWithdraw: true,
              maxWithdraw: true,
              withdrawFee: true,
              dallyDepositLimit: true,
              dallyWithdrawLimit: true,
              maxDeposit: true,
              minDeposit: true,
              dallyDepositLimitAmount: true,
              dallyWithdrawLimitAmount: true,
            },
          });
        } else {
          // Create new
          return await tx.setting.create({
            data: {
              commission: commission || "",
              minWithdraw: minWithdraw || 0,
              maxWithdraw: maxWithdraw || 0,
              withdrawFee: withdrawFee || "0",
              dallyDepositLimit: dallyDepositLimit || 0,
              dallyWithdrawLimit: dallyWithdrawLimit || 0,
              maxDeposit: maxDeposit || 0,
              minDeposit: minDeposit || 0,
              dallyDepositLimitAmount: dallyDepositLimitAmount || 0,
              dallyWithdrawLimitAmount: dallyWithdrawLimitAmount || 0,
            },
            select: {
              id: true,
              commission: true,
              minWithdraw: true,
              maxWithdraw: true,
              withdrawFee: true,
              dallyDepositLimit: true,
              dallyWithdrawLimit: true,
              maxDeposit: true,
              minDeposit: true,
              dallyDepositLimitAmount: true,
              dallyWithdrawLimitAmount: true,
            },
          });
        }
      });

      return res.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error updating settings:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
};

// TaskInfo CRUD Operations
export const taskInfoController = {
  // Get all task info - GOOD (single query)
  getAllTaskInfo: async (req: Request, res: Response) => {
    try {
      const taskInfo = await prisma.taskInfo.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          taskId: true,
          taskName: true,
          description: true,
          incomePerTask: true,
          logoDir: true,
        },
      });

      const taskInfoWithUrls = taskInfo.map((task) => ({
        ...task,
        logoUrl: task.logoDir
          ? `/uploads/system/${path.basename(task.logoDir)}`
          : null,
      }));

      return res.json({ success: true, data: taskInfoWithUrls });
    } catch (error) {
      console.error("Error fetching task info:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Create task info - GOOD (single query)
  createTaskInfo: async (req: Request, res: Response) => {
    try {
      const { taskId, taskName, description, incomePerTask } = req.body;

      let logoDir: string | null = null;
      const files: any = req.files;
      if (Array.isArray(files)) {
        if (files.length > 0) {
          logoDir = `${files[0].filename}`;
        }
      } else if (files && typeof files === "object") {
        const logoFiles = files.logo as any[] | undefined;
        if (logoFiles && logoFiles.length > 0) {
          logoDir = `${logoFiles[0].filename}`;
        }
      }

      const taskInfo = await prisma.taskInfo.create({
        data: {
          taskId,
          taskName,
          description,
          incomePerTask: parseInt(incomePerTask),
          logoDir,
        },
        select: {
          id: true,
          taskId: true,
          taskName: true,
          description: true,
          incomePerTask: true,
          logoDir: true,
        },
      });

      return res.json({
        success: true,
        data: {
          ...taskInfo,
          logoUrl: logoDir ? `/uploads/system/${logoDir}` : null,
        },
      });
    } catch (error) {
      console.error("❌ Error creating task info:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Update task info - FIXED: Use transaction for file + DB operation
  updateTaskInfo: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { taskId, taskName, description, incomePerTask } = req.body;

      // Use transaction for file + DB operation
      const result = await prisma.$transaction(async (tx) => {
        // Get current task info
        const currentTask = await tx.taskInfo.findUnique({
          where: { id: parseInt(id) },
          select: { logoDir: true },
        });

        let logoDir = currentTask?.logoDir;
        const files: any = req.files;

        if (Array.isArray(files) && files.length > 0) {
          logoDir = `${files[0].filename}`;
        } else if (files?.logo?.[0]) {
          logoDir = `${files.logo[0].filename}`;
        }

        // Update in DB
        const taskInfo = await tx.taskInfo.update({
          where: { id: parseInt(id) },
          data: {
            taskId,
            taskName,
            description,
            incomePerTask: parseInt(incomePerTask),
            logoDir,
          },
          select: {
            id: true,
            taskId: true,
            taskName: true,
            description: true,
            incomePerTask: true,
            logoDir: true,
          },
        });

        return taskInfo;
      });

      return res.json({
        success: true,
        data: {
          ...result,
          logoUrl: result.logoDir ? `/uploads/system/${result.logoDir}` : null,
        },
      });
    } catch (error) {
      console.error("Error updating task info:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Delete task info - FIXED: Use transaction for file + DB operation
  deleteTaskInfo: async (req: Request, res: Response) => {
    try {
      const id = req.body.id || req.params.id;

      if (!id) {
        return res.status(400).json({ error: "Task info ID is required" });
      }

      // Use transaction for file + DB operation
      await prisma.$transaction(async (tx) => {
        // Get task info to delete associated file
        const taskInfo = await tx.taskInfo.findUnique({
          where: { id: parseInt(id) },
          select: { logoDir: true },
        });

        // Delete from DB first
        await tx.taskInfo.delete({
          where: { id: parseInt(id) },
        });

        // Then delete file if exists
        if (taskInfo?.logoDir) {
          const filePath = path.join(
            __dirname,
            "../uploads/system",
            taskInfo.logoDir,
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });

      return res.json({
        success: true,
        message: "Task info deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task info:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
};

// VIP CRUD Operations
export const vipController = {
  // Get all VIP levels - GOOD (single query)
  getAllVips: async (req: Request, res: Response) => {
    try {
      const vips = await prisma.vip.findMany({
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
      });

      const vipsWithUrls = vips.map((vip) => ({
        ...vip,
        logoUrl: vip.logoDir
          ? `/uploads/system/${path.basename(vip.logoDir)}`
          : null,
      }));

      return res.json({ success: true, data: vipsWithUrls });
    } catch (error) {
      console.error("Error fetching VIP levels:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Create VIP level - GOOD (single query)
  createVip: async (req: Request, res: Response) => {
    try {
      const {
        name,
        price,
        dailyIncome,
        incomePerTask,
        commission,
        description,
        dailyTask,
      } = req.body;

      let logoDir: string | null = null;
      const files: any = req.files;
      if (Array.isArray(files)) {
        if (files.length > 0) {
          logoDir = `${files[0].filename}`;
        }
      } else if (files && typeof files === "object") {
        const logoFiles = files.logo as any[] | undefined;
        if (logoFiles && logoFiles.length > 0) {
          logoDir = `${logoFiles[0].filename}`;
        }
      }

      const vip = await prisma.vip.create({
        data: {
          name,
          price: parseInt(price),
          dailyIncome: parseInt(dailyIncome),
          incomePerTask: parseInt(incomePerTask),
          commission: parseInt(commission),
          description,
          logoDir,
          dailyTask: dailyTask ? parseInt(dailyTask) : null,
        },
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
      });

      return res.json({
        success: true,
        data: {
          ...vip,
          logoUrl: logoDir ? `/uploads/system/${logoDir}` : null,
        },
      });
    } catch (error) {
      console.error("Error creating VIP level:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Update VIP level - FIXED: Use transaction for file + DB operation
  updateVip: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        name,
        price,
        dailyIncome,
        incomePerTask,
        commission,
        description,
        dailyTask,
      } = req.body;

      // Use transaction for file + DB operation
      const result = await prisma.$transaction(async (tx) => {
        // Get current VIP
        const currentVip = await tx.vip.findUnique({
          where: { id: parseInt(id) },
          select: { logoDir: true },
        });

        let logoDir = currentVip?.logoDir;
        const files: any = req.files;

        if (Array.isArray(files) && files.length > 0) {
          logoDir = `${files[0].filename}`;
        } else if (files?.logo?.[0]) {
          logoDir = `${files.logo[0].filename}`;
        }

        // Update in DB
        const vip = await tx.vip.update({
          where: { id: parseInt(id) },
          data: {
            name,
            price: parseInt(price),
            dailyIncome: parseInt(dailyIncome),
            incomePerTask: parseInt(incomePerTask),
            commission: parseInt(commission),
            description,
            logoDir,
            dailyTask: dailyTask ? parseInt(dailyTask) : null,
          },
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
        });

        return vip;
      });

      return res.json({
        success: true,
        data: {
          ...result,
          logoUrl: result.logoDir ? `/uploads/system/${result.logoDir}` : null,
        },
      });
    } catch (error) {
      console.error("Error updating VIP level:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Delete VIP level - FIXED: Use transaction for file + DB operation
  deleteVip: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Use transaction for file + DB operation
      await prisma.$transaction(async (tx) => {
        // Get VIP to delete associated file
        const vip = await tx.vip.findUnique({
          where: { id: parseInt(id) },
          select: { logoDir: true },
        });

        // Delete from DB first
        await tx.vip.delete({
          where: { id: parseInt(id) },
        });

        // Then delete file if exists
        if (vip?.logoDir) {
          const filePath = path.join(
            __dirname,
            "../public/uploads/system",
            vip.logoDir,
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });

      return res.json({
        success: true,
        message: "VIP level deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting VIP level:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
};
