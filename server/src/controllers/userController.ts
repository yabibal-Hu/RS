// src/controllers/userController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../lib/jwt";
import { AuthRequest } from "../middleware/auth";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

export const usersController = {
  // ✅ profile - ALREADY GOOD (single query)
  profile: async (req: AuthRequest, res: Response) => {
    try {
      const userInfo = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          phone: true,
          name: true,
          role: true,
          inviteCode: true,
          invitedBy: true,
          invitedAt: true,
          createdAt: true,
          profile: {
            select: {
              currentBalance: true,
              referralIncome: true,
              vip: {
                select: {
                  name: true,
                  dailyIncome: true,
                  incomePerTask: true,
                  commission: true,
                },
              },
            },
          },
        },
      });

      if (!userInfo) {
        return res
          .status(404)
          .json({ error: "User not found", success: false });
      }

      return res.status(200).json({ user: userInfo, success: true });
    } catch (error) {
      console.error("User info error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ updateName - FIXED: Add transaction
  updateName: async (req: Request, res: Response) => {
    try {
      const { token, name } = req.body;
      const user = await verifyToken(token);

      if (!user || typeof user === "string" || !("id" in user)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { name },
        select: { id: true }, // Only select what we need
      });

      return res.json({ message: "User name updated" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ balance - FIXED: Use transaction to combine 4 queries into 1
  balance: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      // BEFORE: 4 separate queries = 4 connections
      // AFTER: 1 transaction with 4 queries = 1 connection
      const result = await prisma.$transaction(async (tx) => {
        const userInfo = await tx.user.findUnique({
          where: { id: userId },
          select: {
            name: true,
            phone: true,
            profile: {
              select: {
                currentBalance: true,
                vipName: true,
                referralIncome: true,
              },
            },
          },
        });

        const totalWithdraw = await tx.transaction.aggregate({
          where: { userId, type: "WITHDRAW" },
          _sum: { amount: true },
        });

        const totalDeposit = await tx.transaction.aggregate({
          where: { userId, type: "DEPOSIT" },
          _sum: { amount: true },
        });

        const totalCommission = await tx.transaction.aggregate({
          where: { userId, type: "COMMISSION" },
          _sum: { amount: true },
        });

        return {
          userInfo,
          totalWithdraw,
          totalDeposit,
          totalCommission,
        };
      });

      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  // ✅ deposit - ALREADY GOOD (uses transaction)

  deposit: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const amount = Number(req.body.amount);
      const paymentMethod = req.body.paymentMethod;
      const depositType = req.body.depositType;
      if (isNaN(amount) || amount <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid amount", success: false });
      }

      if (!paymentMethod || !depositType) {
        return res
          .status(400)
          .json({ error: "Missing required fields", success: false });
      }

      // Generate idempotency key
      const idempotencyKey =
        req.body.idempotencyKey || `deposit-${userId}-${Date.now()}`;
      // ALREADY USING TRANSACTION - GOOD!
      const result = await prisma.$transaction(async (tx) => {
        if (depositType !== "FUND_D") {
          if (!depositType || !paymentMethod || !amount) {
            return res
              .status(400)
              .json({ error: "Missing required fields", success: false });
          }

          // Check file exists before anything else
          if (!req.file) {
            return res
              .status(400)
              .json({ error: "Receipt file is required", success: false });
          }

          if (!req.file.buffer || req.file.buffer.length === 0) {
            return res
              .status(400)
              .json({ error: "Empty file received", success: false });
          }

          // STEP 2: Check idempotency FIRST (quick check)
          const existingOrder = await prisma.order.findFirst({
            where: { userId, idempotencyKey },
          });

          if (existingOrder) {
            return res.json({
              message: "Deposit already exists",
              data: existingOrder,
              success: true,
            });
          }

          // STEP 3: Get all data needed for validation
          const [settings, userProfile, pendingOrdersCount, vipPrices] =
            await Promise.all([
              prisma.setting.findFirst({ select: { minDeposit: true } }),
              prisma.profile.findUnique({
                where: { userId },
                select: { currentBalance: true, vipName: true },
              }),
              prisma.order.count({ where: { userId, status: "PENDING" } }),
              prisma.vip.findMany({
                orderBy: { price: "asc" },
                select: { price: true, name: true },
              }),
            ]);

          // STEP 4: Validate all conditions
          if (!userProfile) {
            return res
              .status(400)
              .json({ error: "User profile not found", success: false });
          }

          const userBalance = userProfile.currentBalance || 0;
          const minDeposit = settings?.minDeposit || 0;
          const currentVipName = userProfile.vipName || "";

          // Check minimum deposit for non-VIP users
          if (currentVipName === "0" && amount < minDeposit) {
            return res.status(400).json({
              error: `Minimum deposit amount is ${minDeposit}`,
              success: false,
            });
          }

          // Check pending requests
          if (pendingOrdersCount >= 1) {
            return res.status(400).json({
              error: "You have a pending request",
              success: false,
            });
          }

          // Find user's VIP price
          const userVip = vipPrices.find((v) => v.name === userProfile.vipName);
          const userVipPrice = userVip?.price || 0;
          const vipPriceValues = vipPrices.map((v) => v.price);

          // Check if deposit amount leads to a valid VIP level
          const newBalance = userBalance + amount;
          if (!vipPriceValues.includes(newBalance + userVipPrice)) {
            return res.status(400).json({
              error: `Your current balance is ${userBalance}. You can't deposit ${amount} here.`,
              success: false,
            });
          }

          // STEP 5: ALL VALIDATIONS PASSED - Now upload to Cloudinary
          let receiptUrl: string;
          try {
            const fileBase64 = req.file.buffer.toString("base64");
            const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

            const cloudinaryResult = await cloudinary.uploader.upload(dataUri, {
              folder: "rs",
              allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
              transformation: [{ width: 1000, crop: "limit" }],
              public_id: `receipt-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            });

            receiptUrl = cloudinaryResult.secure_url;
          } catch (cloudinaryError) {
            console.error("Cloudinary upload error details:", cloudinaryError);
            return res.status(500).json({
              error: "Failed to upload receipt",
              details:
                cloudinaryError instanceof Error
                  ? cloudinaryError.message
                  : "Unknown error",
              success: false,
            });
          }

          // STEP 6: Finally, create order in a transaction (fast DB ops only)
          try {
            const order = await prisma.$transaction(
              async (tx) => {
                // Double-check conditions to prevent race conditions
                const [pendingCheck, profileCheck] = await Promise.all([
                  tx.order.count({ where: { userId, status: "PENDING" } }),
                  tx.profile.findUnique({
                    where: { userId },
                    select: { currentBalance: true, vipName: true },
                  }),
                ]);

                if (pendingCheck >= 1) {
                  throw new Error(
                    "A pending request was created while processing",
                  );
                }

                if (!profileCheck) {
                  throw new Error("Profile not found");
                }

                // Quick validation of balance (in case it changed)
                const vipCheck = await tx.vip.findMany({
                  orderBy: { price: "asc" },
                  select: { price: true, name: true },
                });

                const userVipCheck = vipCheck.find(
                  (v) => v.name === profileCheck.vipName,
                );
                const userVipPriceCheck = userVipCheck?.price || 0;
                const vipPriceValuesCheck = vipCheck.map((v) => v.price);
                const newBalanceCheck =
                  profileCheck.currentBalance + Number(amount);

                if (
                  !vipPriceValuesCheck.includes(
                    newBalanceCheck + userVipPriceCheck,
                  )
                ) {
                  throw new Error("Balance changed during processing");
                }

                // Create the order
                return await tx.order.create({
                  data: {
                    userId,
                    type: "DEPOSIT",
                    status: "PENDING",
                    depositType,
                    paymentMethod,
                    amount: Number(amount),
                    receipt: receiptUrl,
                    idempotencyKey,
                  },
                  select: {
                    id: true,
                    amount: true,
                    status: true,
                    createdAt: true,
                  },
                });
              },
              { timeout: 5000 },
            );

            return res.json({
              message: "Deposit request created successfully",
              data: order,
              success: true,
            });
          } catch (error) {
            // If transaction fails, consider deleting the uploaded image
            // Or implement a cleanup mechanism
            console.error("Transaction failed after upload:", error);

            return res.status(400).json({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create deposit",
              success: false,
            });
          }
        } else {
          // STEP 1: Validate everything that DOESN'T need the file FIRST
          // Validate input data
          if (!depositType || !paymentMethod || !amount) {
            return res
              .status(400)
              .json({ error: "Missing required fields", success: false });
          }

          // Validate file exists (but don't process it yet)
          if (!req.file) {
            return res
              .status(400)
              .json({ error: "Receipt file is required", success: false });
          }

          if (!req.file.buffer || req.file.buffer.length === 0) {
            return res
              .status(400)
              .json({ error: "Empty file received", success: false });
          }

          // STEP 2: Check database conditions (but don't start transaction yet)
          const userProfile = await prisma.profile.findUnique({
            where: { userId },
            select: { fundIncome: true },
          });

          if (userProfile?.fundIncome !== 0) {
            return res.status(400).json({
              error: `Your current balance is ${userProfile?.fundIncome}. Should withdraw it first before depositing more.`,
              success: false,
            });
          }

          const existingOrder = await prisma.order.findFirst({
            where: { userId, idempotencyKey },
          });

          if (existingOrder) {
            return res.json({
              message: "Deposit already exists",
              data: existingOrder,
              success: true,
            });
          }

          const pendingOrdersCount = await prisma.order.count({
            where: { userId, status: "PENDING" },
          });

          if (pendingOrdersCount >= 1) {
            return res.status(400).json({
              error: "You have a pending request",
              success: false,
            });
          }

          // STEP 3: ALL VALIDATIONS PASSED - Now upload to Cloudinary
          let receiptUrl: string;
          try {
            const fileBase64 = req.file.buffer.toString("base64");
            const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

            const cloudinaryResult = await cloudinary.uploader.upload(dataUri, {
              folder: "rs",
              allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
              transformation: [{ width: 1000, crop: "limit" }],
              public_id: `receipt-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            });

            receiptUrl = cloudinaryResult.secure_url;
          } catch (cloudinaryError) {
            console.error("Cloudinary upload error details:", cloudinaryError);
            return res.status(500).json({
              error: "Failed to upload receipt",
              details:
                cloudinaryError instanceof Error
                  ? cloudinaryError.message
                  : "Unknown error",
              success: false,
            });
          }

          // STEP 4: Finally, create the order in a transaction (fast DB ops only)
          try {
            const order = await prisma.$transaction(
              async (tx) => {
                // Double-check conditions inside transaction to prevent race conditions
                const pendingCheck = await tx.order.count({
                  where: { userId, status: "PENDING" },
                });

                if (pendingCheck >= 1) {
                  throw new Error(
                    "A pending request was created while processing",
                  );
                }

                const profileCheck = await tx.profile.findUnique({
                  where: { userId },
                  select: { fundIncome: true },
                });

                if (profileCheck?.fundIncome !== 0) {
                  throw new Error("Balance changed during processing");
                }

                // Create the order
                return await tx.order.create({
                  data: {
                    userId,
                    type: "FUND_D",
                    status: "PENDING",
                    depositType,
                    paymentMethod,
                    amount,
                    receipt: receiptUrl,
                    idempotencyKey,
                  },
                  select: {
                    id: true,
                    amount: true,
                    status: true,
                    createdAt: true,
                  },
                });
              },
              { timeout: 5000 },
            ); // Now 5 seconds is plenty!

            return res.json({
              message: "Deposit request created successfully",
              data: order,
              success: true,
            });
          } catch (error) {
            // If transaction fails, you might want to delete the uploaded image
            // Or just let it be - depends on your business logic
            console.error("Transaction failed after upload:", error);

            return res.status(400).json({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create deposit",
              success: false,
            });
          }
        }
      });

      return res.json({
        message: "Order created successfully",
        // receipt: receiptUrl,
        data: result,
        success: true,
      });
    } catch (error) {
      console.error("Deposit error:", error);

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message, success: false });
      }

      return res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  },

  // ✅ depositOrders - GOOD (single query)
  depositOrders: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const orders = await prisma.order.findMany({
        where: {
          userId: userId,
          depositType: "DEPOSIT",
          status: { in: ["COMPLETED", "PENDING"] },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          status: true,
          paymentMethod: true,
          amount: true,
          createdAt: true,
        },
      });
      return res.json({ orders, success: true });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },
  // ✅ fundOrders - GOOD (single query)
  fundOrders: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }
      const userProfile = await prisma.profile.findUnique({
        where: { userId },
        select: { fundIncome: true, NextFundWithdraw: true },
      });
      // get user fundIncome from profile
      const fundIncome = userProfile?.fundIncome || 0;
      const NextFundWithdraw = userProfile?.NextFundWithdraw || null;
      let showWithdrawButton = false;
      // check  NextFundWithdraw is less than current time, if yes set it to null and fundIncome to 0
      if (
        fundIncome !== 0 &&
        NextFundWithdraw &&
        new Date(NextFundWithdraw) < new Date()
      ) {
        showWithdrawButton = true;
      }

      const orders = await prisma.order.findMany({
        where: { userId: userId, type: "FUND_D", depositType: "FUND_D" },
        orderBy: { createdAt: "desc" },
        select: {
          status: true,
          paymentMethod: true,
          amount: true,
          depositType: true,
          type: true,
          createdAt: true,
        },
      });
      return res.json({
        orders,
        fundIncome,
        NextFundWithdraw,
        showWithdrawButton,
        success: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  // ✅ referrals - FIXED: Use transaction to combine 3 queries into 1
  referrals: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", status: 401 });
      }

      // BEFORE: 3 separate queries = 3 connections
      // AFTER: 1 transaction = 1 connection
      const result = await prisma.$transaction(async (tx) => {
        const userProfile = await tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            inviteCode: true,
          },
        });

        if (!userProfile) {
          return res.status(400).json({ error: "User not found", status: 400 });
        }

        const referralsCount = await tx.user.count({
          where: { invitedBy: userProfile.inviteCode },
        });

        const activeReferralsCount = await tx.user.count({
          where: { invitedBy: userProfile.inviteCode, status: "1" },
        });

        const commissionTransactions = await tx.transaction.findMany({
          where: { userId: userProfile.id, type: "COMMISSION" },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            amount: true,
            createdAt: true,
            type: true,
          },
        });

        return {
          referrals: referralsCount,
          activeReferrals: activeReferralsCount,
          commissionTransactions,
          invitationCode: userProfile.inviteCode,
        };
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Internal server error`, status: 500 });
    }
  },

  // ✅ withdraw - ALREADY GOOD (uses transaction with Promise.all)
  withdraw: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const { amount, method, accountOwner, useAccount, phone, type } =
        req.body;

      const withdrawAmount = Number(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid amount", success: false });
      }

      if (!method || !accountOwner || !useAccount) {
        return res
          .status(400)
          .json({ error: "Missing required fields", success: false });
      }

      const idempotencyKey =
        req.body.idempotencyKey || `withdraw-${userId}-${Date.now()}`;
      // ALREADY USING TRANSACTION WITH Promise.all - GOOD!
      const result = await prisma.$transaction(async (tx) => {
        const existingOrder = await tx.order.findFirst({
          where: {
            userId,
            idempotencyKey,
          },
        });

        if (existingOrder) {
          return existingOrder;
        }

        const [userProfile, siteSettings, pendingWithdrawalsCount] =
          await Promise.all([
            tx.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                profile: {
                  select: {
                    currentBalance: true,
                  },
                },
              },
            }),
            tx.setting.findFirst({
              select: {
                minWithdraw: true,
                maxWithdraw: true,
              },
            }),
            tx.order.count({
              where: {
                userId,
                status: "PENDING",
              },
            }),
          ]);

        if (!userProfile?.profile) {
          return res.status(400).json({
            error: "User profile not found",
            success: false,
          });
        }

        const currentBalance = userProfile.profile.currentBalance;
        const minWithdraw = siteSettings?.minWithdraw || 0;
        const maxWithdraw = siteSettings?.maxWithdraw || 0;

        if (withdrawAmount < minWithdraw) {
          return res.status(400).json({
            error: `Minimum withdrawal amount is ${minWithdraw}`,
            success: false,
          });
        }

        if (withdrawAmount > maxWithdraw) {
          return res.status(400).json({
            error: `Maximum withdrawal amount is ${maxWithdraw}`,
            success: false,
          });
        }

        if (currentBalance < withdrawAmount) {
          return res.status(400).json({
            error: "Not enough balance",
            success: false,
          });
        }

        if (pendingWithdrawalsCount >= 1) {
          return res.status(400).json({
            error: "You have a pending withdrawal request",
            success: false,
          });
        }

        const [order] = await Promise.all([
          tx.order.create({
            data: {
              userId,
              amount: withdrawAmount,
              type: type,
              paymentMethod: method,
              accountOwner,
              useAccount,
              phone,
              status: "PENDING",
              idempotencyKey,
            },
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true,
              paymentMethod: true,
            },
          }),
          tx.profile.update({
            where: { userId },
            data: {
              currentBalance: {
                decrement: withdrawAmount,
              },
            },
          }),
        ]);

        return order;
      });

      return res.json({
        message: "Withdrawal request created successfully",
        data: result,
        success: true,
      });
    } catch (error) {
      console.error("Withdraw error:", error);

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message, success: false });
      }

      return res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  },

  withdrawFunds: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const { amount, method, accountOwner, useAccount, phone, type } =
        req.body;

      const withdrawAmount = Number(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid amount", success: false });
      }

      if (!method || !accountOwner || !useAccount) {
        return res
          .status(400)
          .json({ error: "Missing required fields", success: false });
      }

      const idempotencyKey =
        req.body.idempotencyKey || `withdraw-${userId}-${Date.now()}`;
      // ALREADY USING TRANSACTION WITH Promise.all - GOOD!
      const result = await prisma.$transaction(
        async (tx) => {
          const existingOrder = await tx.order.findFirst({
            where: { userId, idempotencyKey },
          });

          if (existingOrder) {
            return existingOrder;
          }

          // COMBINE ALL QUERIES into one Promise.all
          const [userProfile, pendingWithdrawalsCount] = await Promise.all([
            tx.user.findUnique({
              where: { id: userId },
              select: {
                profile: {
                  select: { fundIncome: true, NextFundWithdraw: true },
                },
              },
            }),
            tx.order.count({
              where: { userId, status: "PENDING" },
            }),
            // Create order and update profile in parallel
          ]);

          // Validate after getting data
          if (!userProfile?.profile) {
            throw new Error("User profile not found");
          }

          if ((userProfile.profile.fundIncome ?? 0) * 3 < withdrawAmount) {
            throw new Error("Not enough balance");
          }
          // check NextFundWithdraw is less than current time, if yes return error message to user
          if (
            userProfile.profile.NextFundWithdraw &&
            userProfile.profile.NextFundWithdraw > new Date()
          ) {
            throw new Error("You cannot withdraw at this time");
          }
          console.log(
            "userProfile.profile.NextFundWithdraw",
            userProfile.profile.NextFundWithdraw,
          );
          console.log("new Date()", new Date());
          console.log("pendingWithdrawalsCount", pendingWithdrawalsCount);
          if (pendingWithdrawalsCount >= 1) {
            throw new Error("You have a pending withdrawal request");
          }

          const [order] = await Promise.all([
            tx.order.create({
              data: {
                userId,
                amount: withdrawAmount,
                type: type,
                paymentMethod: method,
                accountOwner,
                useAccount,
                phone,
                status: "PENDING",
                idempotencyKey,
              },
              select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                paymentMethod: true,
              },
            }),
            tx.profile.update({
              where: { userId },
              data: {
                fundIncome: 0,
              },
            }),
          ]);

          return order;
        },
        {
          timeout: 10000, // Still good to increase slightly
        },
      );

      return res.json({
        message: "Withdrawal request created successfully",
        data: result,
        success: true,
      });
    } catch (error) {
      console.error("Withdraw error:", error);

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message, success: false });
      }

      return res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  },

  // ✅ withdrawOrders - GOOD (single query)
  withdrawOrders: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const orders = await prisma.order.findMany({
        where: {
          userId: userId,
          type: "WITHDRAW",
          status: { in: ["COMPLETED", "PENDING"] },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          status: true,
          paymentMethod: true,
          amount: true,
          createdAt: true,
        },
      });

      return res.json({ orders, success: true });
    } catch (err) {
      console.error("Withdraw Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ vip - FIXED: Use transaction
  vip: async (req: Request, res: Response) => {
    try {
      const { vipLevel, token } = req.body;

      if (!vipLevel || typeof vipLevel !== "string") {
        return res.status(400).json({ error: "VIP level is required" });
      }

      const user = await verifyToken(token);
      if (!user || !user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // BEFORE: 4 separate queries = 4 connections
      // AFTER: 1 transaction = 1 connection
      const result = await prisma.$transaction(async (tx) => {
        // Get settings, profile, and VIP in parallel within transaction
        const [settings, userProfile, vip] = await Promise.all([
          tx.setting.findFirst({
            select: { commission: true },
          }),
          tx.profile.findUnique({
            where: { userId: user.id },
          }),
          tx.vip.findUnique({
            where: { name: vipLevel },
          }),
        ]);

        if (!userProfile) {
          return res.status(400).json({
            error: "User profile not found",
            success: false,
          });
        }

        if (!vip) {
          return res.status(400).json({
            error: "VIP level not found",
            success: false,
          });
        }

        if (userProfile.currentBalance < vip.price) {
          return res.status(400).json({
            error: "Not enough balance",
            success: false,
          });
        }

        // Update user VIP level
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            status: "1",
            profile: {
              update: {
                vip: { connect: { name: vipLevel } },
                currentBalance: {
                  decrement: vip.price,
                },
              },
            },
            transactions: {
              create: {
                type: "VIP",
                amount: vip.price,
              },
            },
          },
          select: {
            id: true,
            phone: true,
            role: true,
            status: true,
            profile: {
              select: {
                currentBalance: true,
                vipName: true,
                vip: {
                  select: {
                    name: true,
                    price: true,
                    dailyIncome: true,
                    incomePerTask: true,
                    commission: true,
                  },
                },
              },
            },
          },
        });

        return updatedUser;
      });

      return res.json({
        success: true,
        message: "VIP level updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("VIP Update Error:", error);
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ taskInfo - ALREADY GOOD (uses transaction)
  taskInfo: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { searchParams } = new URL(req.url, `${process.env.API_URL}`);
      const timeIsUp = searchParams.get("timeIsUp") === "true";

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID is required", status: 400 });
      }

      // ALREADY USING TRANSACTION - GOOD!
      const result = await prisma.$transaction(async (tx) => {
        const userData = await tx.user.findUnique({
          where: { id: userId },
          select: {
            profile: {
              select: {
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
                userId: true,
              },
            },
          },
        });

        if (!userData) {
          return res.status(400).json({
            error: "User not found",
            success: false,
          });
        }

        if (userData.task.length === 0) {
          const taskInfoList = await tx.taskInfo.findMany({
            select: { id: true },
          });

          if (taskInfoList.length > 0) {
            await tx.task.createMany({
              data: taskInfoList.map((taskInfo) => ({
                userId,
                taskInfoId: taskInfo.id,
                status: "0",
              })),
              skipDuplicates: true,
            });

            userData.task = await tx.task.findMany({
              where: { userId },
              select: {
                id: true,
                taskInfoId: true,
                status: true,
                updatedAt: true,
                userId: true,
              },
            });
          }
        }

        if (userData.task.length > 0) {
          const latestTask = userData.task.reduce((prev, current) => {
            return prev.updatedAt > current.updatedAt ? prev : current;
          });

          const allTasksCompleted = userData.task.every(
            (task) => task.status === "1",
          );

          const now = new Date();
          const twentyFourHoursAgo = new Date(
            now.getTime() - 24 * 60 * 60 * 1000,
          );

          if (
            timeIsUp &&
            latestTask.updatedAt < twentyFourHoursAgo &&
            allTasksCompleted
          ) {
            await tx.task.updateMany({
              where: { userId },
              data: { status: "0" },
            });

            userData.task = userData.task.map((task) => ({
              ...task,
              status: "0",
            }));
          }
        }

        return userData;
      });

      return res.json({ success: true, data: result });
    } catch (error) {
      console.error("Task Info Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ makeTask - FIXED: Complete the implementation
  makeTask: async (req: AuthRequest, res: Response) => {
    const { taskInfoId } = req.body;
    const id = Number(taskInfoId);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // STEP 1: Get all data needed for validation (outside transaction)
      const [user, existingTask] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          include: {
            profile: {
              include: {
                vip: true,
              },
            },
          },
        }),
        prisma.task.findUnique({
          where: {
            userId_taskInfoId: { userId, taskInfoId: id },
          },
        }),
      ]);

      // STEP 2: Validate (outside transaction)
      if (!user?.profile) {
        return res.status(400).json({
          error: "User profile not found",
          success: false,
        });
      }

      if (!existingTask) {
        return res.status(400).json({
          error: "Task not found",
          success: false,
        });
      }

      if (existingTask.status === "1") {
        return res.status(400).json({
          error: "You've already completed this task today",
          success: false,
        });
      }

      const incomePerTask = user.profile.vip?.incomePerTask || 0;
      const newBalance = user.profile.currentBalance + incomePerTask;

      // STEP 3: Do only writes in transaction
      const result = await prisma.$transaction(
        async (tx) => {
          // Get pending tasks count FIRST
          const pendingTasks = await tx.task.count({
            where: { userId, status: "0" },
          });

          // Update task
          await tx.task.update({
            where: {
              userId_taskInfoId: { userId, taskInfoId: id },
            },
            data: { status: "1" },
          });

          // Create transaction record
          await tx.transaction.create({
            data: {
              userId,
              type: "TASK",
              amount: incomePerTask,
            },
          });

          // Update profile
          await tx.profile.update({
            where: { userId },
            data: {
              currentBalance: newBalance,
              totalIncome: { increment: incomePerTask },
            },
          });

          // Update task status if all completed
          if (pendingTasks <= 1) {
            // <=1 because current task will be completed
            await tx.profile.update({
              where: { userId },
              data: { taskStatus: "1" },
            });
          }

          return {
            success: true,
            newBalance,
            earnings: incomePerTask,
          };
        },
        {
          timeout: 15000, // Now 5 seconds is enough!
        },
      );

      return res.json(result);
    } catch (error) {
      console.error("Task error:", error);

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
          success: false,
        });
      }
      return res.status(500).json({
        error: "Failed to process task",
        success: false,
      });
    }
  },

// API endpoint to get user's referral tree
getReferralStats: async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  
  try {
    // Get current user's inviteCode
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { inviteCode: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    // Get level 1 (direct referrals)
    const level1 = await prisma.user.findMany({
      where: { invitedBy: currentUser.inviteCode },
      select: { 
        id: true,
        inviteCode: true
      }
    });

    // Get level 2 (referrals of referrals)
    const level1InviteCodes = level1.map(u => u.inviteCode);
    const level2 = await prisma.user.findMany({
      where: { invitedBy: { in: level1InviteCodes } },
      select: { 
        id: true,
        inviteCode: true
      }
    });

    // Get level 3
    const level2InviteCodes = level2.map(u => u.inviteCode);
    const level3 = await prisma.user.findMany({
      where: { invitedBy: { in: level2InviteCodes } },
      select: { 
        id: true
      }
    });

    // Return only counts
    const stats = {
      level1: level1.length,
      level2: level2.length,
      level3: level3.length,
      totalReferrals: level1.length + level2.length + level3.length
    };

    return res.json({ success: true, data: stats });
  } catch (error: any) {
    console.error("Referral stats error:", error);
    return res.status(500).json({ error: error.message, success: false });
  }
}




};

/**
import Tree from 'react-d3-tree';

function ReferralTree({ data }) {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Tree 
        data={data}
        orientation="vertical"
        pathFunc="straight"
        translate={{ x: 300, y: 100 }}
        nodeSize={{ x: 200, y: 100 }}
      />
    </div>
  );
}

*/