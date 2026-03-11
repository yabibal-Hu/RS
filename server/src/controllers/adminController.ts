// src/controllers/adminController.ts
import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

interface OrderUser {
  name?: string | null;
  phone?: string | null;
}

interface OrderFromDB {
  id: string | number;
  amount: number;
  status: string;
  createdAt: Date;
  user?: OrderUser;
}

interface MappedOrder extends Omit<OrderFromDB, "user"> {
  name: string | null;
  phone: string | null;
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export const adminController = {
  // ✅ FIXED: getUsers - Use transaction to combine queries
  getUsers: async (req: AuthRequest, res: Response) => {
    try {
      const role = req.role;
      if (!role || role === "USER") {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const { page = "1", limit = "10", search = "" } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const searchTerm = (search as string).trim();
      const skip = (pageNum - 1) * limitNum;

      let whereClause: any = { role: "USER" };

      if (searchTerm !== "") {
        whereClause.OR = [
          { name: { contains: searchTerm } },
          { phone: { contains: searchTerm } },
          { inviteCode: { contains: searchTerm } },
        ];
      }

      // BEFORE: Separate queries = multiple connections
      // AFTER: Transaction = 1 connection
      const result = await prisma.$transaction(async (tx) => {
        const users = await tx.user.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            status: true,
            inviteCode: true,
            invitedBy: true,
            invitedAt: true,
            createdAt: true,
            profile: {
              select: {
                vip: { select: { name: true } },
                currentBalance: true,
              },
            },
          },
          orderBy: { profile: { vip: { name: "desc" } } },
          skip,
          take: limitNum,
        });

        const totalCount = await tx.user.count({ where: whereClause });

        if (users.length === 0) {
          return { users: [], totalCount };
        }

        // Get ALL transaction totals in ONE query
        const userIds = users.map((u) => u.id);
        const transactionTotals = await tx.$queryRaw<any[]>`
          SELECT 
            userId,
            COALESCE(SUM(CASE WHEN type = 'DEPOSIT' THEN amount ELSE 0 END), 0) as totalDeposits,
            COALESCE(SUM(CASE WHEN type = 'WITHDRAW' THEN amount ELSE 0 END), 0) as totalWithdraws
          FROM Transaction
          WHERE userId IN (${userIds.join(",")})
          GROUP BY userId
        `;

        // Create map for quick lookup
        const totalsMap = new Map();
        for (const row of transactionTotals) {
          totalsMap.set(row.userId, {
            deposits: Number(row.totalDeposits),
            withdraws: Number(row.totalWithdraws),
          });
        }

        // Combine users with stats
        const usersWithStats = users.map((user) => ({
          ...user,
          totalDeposits: totalsMap.get(user.id)?.deposits || 0,
          totalWithdraws: totalsMap.get(user.id)?.withdraws || 0,
          totalOrders: 0,
        }));

        return { users: usersWithStats, totalCount };
      });

      return res.json({
        users: result.users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: result.totalCount,
          pages: Math.ceil(result.totalCount / limitNum),
        },
        success: true,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Server error", success: false });
    }
  },

  // ✅ FIXED: getUserDetails - Already good, but add select
  getUserDetails: async (req: AuthRequest, res: Response) => {
    try {
      const role = req.role;
      if (!role || role === "USER") {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          status: true,
          inviteCode: true,
          invitedBy: true,
          invitedAt: true,
          createdAt: true,
          profile: {
            select: {
              vip: { select: { name: true } },
              currentBalance: true,
            },
          },
          transactions: {
            select: {
              id: true,
              type: true,
              amount: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 50,
          },
          orders: {
            where: { type: "DEPOSIT", status: "COMPLETED" },
            select: {
              id: true,
              amount: true,
              status: true,
              paymentMethod: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found", success: false });
      }

      // Calculate totals
      const totalDeposits = user.transactions.reduce((total, transaction) => {
        return transaction.type === "DEPOSIT"
          ? total + transaction.amount
          : total;
      }, 0);

      const totalWithdraws = user.transactions.reduce((total, transaction) => {
        return transaction.type === "WITHDRAW"
          ? total + transaction.amount
          : total;
      }, 0);

      const totalOrders = user.orders.reduce((total, order) => {
        return total + order.amount;
      }, 0);

      const userWithStats = {
        ...user,
        totalDeposits,
        totalWithdraws,
        totalOrders,
      };

      return res.json({
        user: userWithStats,
        success: true,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({ error: "Server error", success: false });
    }
  },

  // ✅ FIXED: userInfo - Use transaction to combine 9 queries into 1
  userInfo: async (req: AuthRequest, res: Response) => {
    try {
      const role = req.role;
      if (!role || role === "USER") {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      // BEFORE: 9 separate queries = 9 connections
      // AFTER: 1 transaction = 1 connection
      const result = await prisma.$transaction(async (tx) => {
        // User counts
        const [userStats] = await tx.$queryRaw<any[]>`
          SELECT 
            COUNT(*) as totalUsers,
            SUM(CASE WHEN status = '1' THEN 1 ELSE 0 END) as activeUsers
          FROM User
          WHERE role = 'USER'
        `;

        // Order statistics
        const orderStats = await tx.$queryRaw<any[]>`
          SELECT 
            type,
            status,
            COUNT(*) as count,
            SUM(amount) as totalAmount
          FROM \`Order\`
          WHERE type IN ('WITHDRAW', 'DEPOSIT','FUND_D', 'FUND_W')
          GROUP BY type, status
        `;

        // VIP distribution
        const vipStats = await tx.$queryRaw<any[]>`
          SELECT 
            p.vipName,
            COUNT(*) as count
          FROM Profile p
          INNER JOIN User u ON u.id = p.userId
          WHERE u.role = 'USER'
          GROUP BY p.vipName
        `;

        return { userStats, orderStats, vipStats };
      });

      // Process order stats
      const orderMap = new Map();
      for (const stat of result.orderStats) {
        const key = `${stat.type}_${stat.status}`;
        orderMap.set(key, {
          count: Number(stat.count),
          amount: Number(stat.totalAmount || 0),
        });
      }

      const withdrawCompleted = orderMap.get("WITHDRAW_COMPLETED") || {
        count: 0,
        amount: 0,
      };
      const withdrawPending = orderMap.get("WITHDRAW_PENDING") || {
        count: 0,
        amount: 0,
      };
      const depositCompleted = orderMap.get("DEPOSIT_COMPLETED") || {
        count: 0,
        amount: 0,
      };
      const depositPending = orderMap.get("DEPOSIT_PENDING") || {
        count: 0,
        amount: 0,
      };

      const totalFundDeposits = orderMap.get("FUND_D_COMPLETED") || {
        count: 0,
        amount: 0,
      };
      const totalFundWithdraws = orderMap.get("FUND_W_COMPLETED") || {
        count: 0,
        amount: 0,
      };
      const pendingFundWithdraws = orderMap.get("FUND_W_PENDING") || {
        count: 0,
        amount: 0,
      };
      const pendingFundDeposits = orderMap.get("FUND_D_PENDING") || {
        count: 0,
        amount: 0,
      };

      return res.json({
        totalUsers: Number(result.userStats?.totalUsers || 0),
        activeUsers: Number(result.userStats?.activeUsers || 0),
        totalWithdraws: withdrawCompleted.count,
        pendingWithdraws: withdrawPending.count,
        totalWithdrawAmounts: withdrawCompleted.amount,
        totalDeposits: depositCompleted.count,
        pendingDeposits: depositPending.count,
        totalDepositAmounts: depositCompleted.amount,
        totalFundDeposits: totalFundDeposits.count,
        totalFundWithdraws: totalFundWithdraws.count,
        totalFundDepositsAmounts: totalFundDeposits.amount,
        totalFundWithdrawsAmounts: totalFundWithdraws.amount,
        pendingFundWithdrawsCount: pendingFundWithdraws.count,
        pendingFundDepositsCount: pendingFundDeposits.count,
        numberOfUsersWithEachVipName: result.vipStats.map((v) => ({
          vipName: v.vipName,
          count: Number(v.count),
        })),
        success: true,
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
      return res.status(500).json({ error: "Server error", success: false });
    }
  },

  // ✅ FIXED: userOrders - Already good, just clean up
  userOrders: async (req: AuthRequest, res: Response) => {
    try {
      const role = req.role;
      if (!role || role === "USER") {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const { searchParams } = new URL(req.url, `${process.env.API_URL}`);

      const pageSize = Number(
        searchParams.get("pageSize") || DEFAULT_PAGE_SIZE,
      );
      const page = Math.max(
        DEFAULT_PAGE,
        Number(searchParams.get("page") || DEFAULT_PAGE),
      );
      const skip = (page - 1) * pageSize;

      let whereClause: any = {};
      const search = searchParams.get("search") || "";

      // FIX: Consistent where clause
      switch (search) {
        case "DEPOSIT":
          whereClause = { depositType: "DEPOSIT", status: "PENDING" }; // ✅ DEPOSIT or BOTH
          break;
        case "WITHDRAW":
          whereClause = {
            type: { in: ["WITHDRAW", "FUND_W"] },
            status: "PENDING",
          }; // ✅ WITHDRAW or BOTH
          break;
        case "VIP_UPGRADE":
          // depositType VIP_UPGRADE or FUND
          whereClause = {
            depositType: { in: ["VIP_UPGRADE", "FUND_D"] },
            status: "PENDING",
          }; // ✅ WITHDRAW or BOTH
          break;
        case " ":
          whereClause = { depositType: "DEPOSIT", status: "PENDING" }; // ✅ WITHDRAW or BOTH
          break;
        default:
          whereClause = { depositType: "WITHDRAW", status: "PENDING" };
      }

      const [ordersData, totalOrders] = await Promise.all([
        prisma.order.findMany({
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          where: whereClause,
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        }),
        prisma.order.count({ where: whereClause }),
      ]);

      const totalPages = Math.ceil(totalOrders / pageSize);

      const orders: MappedOrder[] = ordersData.map((item: any) => {
        const { user, ...rest } = item;
        return {
          ...rest,
          id: rest.id.toString(),
          name: user?.name || null,
          phone: user?.phone || null,
        };
      });

      return res.json({
        orders,
        totalPages,
        currentPage: page,
        success: true,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  },

  // ✅ approveOrder - Already good (uses transaction)
  approveOrder: async (req: AuthRequest, res: Response) => {
    try {
      const role = req.role;
      if (!role || role === "USER") {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const { orderId, type, status } = req.body;

      if (!orderId || !type || !status) {
        return res.status(400).json({
          error: "Missing required fields",
          success: false,
        });
      }

      const orderWithUser = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      });

      if (!orderWithUser) {
        return res.status(400).json({
          error: "Order not found",
          success: false,
        });
      }

      if (!orderWithUser.user?.profile) {
        return res.status(400).json({
          error: "User profile not found",
          success: false,
        });
      }

      const { user } = orderWithUser;
      const userProfile = user.profile;

      const result = await prisma.$transaction(
        async (tx) => {
          const updatedOrder = await tx.order.update({
            where: { id: Number(orderId) },
            data: { status },
            select: {
              id: true,
              status: true,
              amount: true,
              type: true,
            },
          });

          if (
            status === "COMPLETED" &&
            type === "DEPOSIT" &&
            (role === "SUPER_ADMIN" || role === "ADMIN")
          ) {
            await handleDepositCompletion(tx, user, userProfile, orderWithUser);
          }

          if (
            status === "COMPLETED" &&
            type === "FUND_D" &&
            (role === "SUPER_ADMIN" || role === "ADMIN")
          ) {
            await handleFundDepositCompletion(
              tx,
              user,
              userProfile,
              orderWithUser,
            );
          }

          if (status === "COMPLETED" && type === "WITHDRAW") {
            await tx.transaction.create({
              data: {
                type: "WITHDRAW",
                amount: Number(orderWithUser.amount),
                userId: user.id,
              },
            });
          }

          if (status === "REJECTED" && type === "WITHDRAW") {
            await tx.profile.update({
              where: { userId: user.id },
              data: {
                currentBalance: { increment: Number(orderWithUser.amount) },
              },
            });
          }
          if (status === "COMPLETED" && type === "FUND_W") {
            await tx.transaction.create({
              data: {
                type: "FUND_W",
                amount: Number(orderWithUser.amount),
                userId: user.id,
              },
            });
          }

          if (status === "REJECTED" && type === "FUND_W") {
            await tx.profile.update({
              where: { userId: user.id },
              data: {
                fundIncome: orderWithUser.amount,
              },
            });
          }

          return updatedOrder;
        },
        {
          timeout: 20000, // 15 seconds
        },
      );

      return res.status(200).json({
        updatedOrder: result,
        success: true,
      });
    } catch (error: any) {
      console.error("Error approving order:", error);
      return res.status(500).json({
        error: "Internal server error",
        success: false,
      });
    }
  },

  // ✅ FIXED: deleteUser - Remove extra check query
  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const role = req.role;
      if (!role || role === "USER") {
        return res.status(401).json({ error: "Unauthorized", success: false });
      }

      const { id } = req.params;

      // BEFORE: Check then delete = 2 connections
      // AFTER: Direct transaction delete = 1 connection
      await prisma.$transaction(async (tx) => {
        await tx.task.deleteMany({ where: { userId: id } });
        await tx.profile.deleteMany({ where: { userId: id } });
        await tx.transaction.deleteMany({ where: { userId: id } });
        await tx.order.deleteMany({ where: { userId: id } });
        await tx.user.delete({ where: { id } });
      });

      return res.json({
        message: "User and all related data deleted successfully",
        success: true,
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);

      if (error.code === "P2025") {
        return res.status(404).json({
          error: "User not found",
          success: false,
        });
      }

      return res.status(500).json({
        error: "Internal server error",
        success: false,
      });
    }
  },
};

// Helper function - already good
// const handleDepositCompletion = async (
//   tx: any,
//   user: any,
//   userProfile: any,
//   order: any,
// ) => {
//   try {
//     const allVips = await tx.vip.findMany({ orderBy: { price: "asc" } });

//     if (!allVips.length) {
//       throw new Error("No VIPs found");
//     }

//     const currentVip = allVips.find((v: any) => v.name === userProfile.vipName);
//     const currentVipPrice = currentVip ? currentVip.price : 0;
//     const currentVipLevel = Number(userProfile.vipName || "0");

//     const currentBalance = Number(userProfile.currentBalance);
//     const depositAmount = Number(order.amount);
//     const newBalance = currentBalance + depositAmount;
//     const calculatedBalance = newBalance + currentVipPrice;

//     const existingVipTransactions = await tx.transaction.findMany({
//       where: {
//         userId: user.id,
//         type: "VIP",
//       },
//     });

//     const hasPurchasedAnyVip = existingVipTransactions.length > 0;

//     const affordableVips = allVips.filter(
//       (v: { price: number; name: string }) => v.price <= calculatedBalance,
//     );

//     const highestAffordableVip =
//       affordableVips.sort(
//         (a: { price: number }, b: { price: number }) => b.price - a.price,
//       )[0] || null;

//     let finalBalance = newBalance;
//     let vipTransactionCreated = false;
//     let shouldUpgradeVip = false;

//     if (highestAffordableVip) {
//       const highestVipLevel = Number(highestAffordableVip.name);

//       if (highestVipLevel > currentVipLevel) {
//         shouldUpgradeVip = true;
//         finalBalance = calculatedBalance - highestAffordableVip.price;

//         await tx.transaction.create({
//           data: {
//             type: "VIP",
//             amount: highestAffordableVip.price,
//             userId: user.id,
//           },
//         });

//         vipTransactionCreated = true;
//       } else if (
//         highestVipLevel === currentVipLevel &&
//         !hasPurchasedAnyVip &&
//         highestAffordableVip.price > 0
//       ) {
//         shouldUpgradeVip = true;
//         finalBalance = calculatedBalance - highestAffordableVip.price;

//         await tx.transaction.create({
//           data: {
//             type: "VIP",
//             amount: highestAffordableVip.price,
//             userId: user.id,
//           },
//         });

//         vipTransactionCreated = true;
//       }
//     }

//     const profileUpdateData: any = {
//       currentBalance: finalBalance,
//       totalDeposit: { increment: depositAmount },
//     };

//     if (shouldUpgradeVip && highestAffordableVip) {
//       profileUpdateData.vipName = highestAffordableVip.name;
//     }

//     await tx.profile.update({
//       where: { userId: user.id },
//       data: profileUpdateData,
//     });

//     if (user.status === "0") {
//       await tx.user.update({
//         where: { id: user.id },
//         data: { status: "1" },
//       });
//     }

//     await tx.transaction.create({
//       data: {
//         type: "DEPOSIT",
//         amount: depositAmount,
//         userId: user.id,
//       },
//     });

//     if (user.invitedBy && user.status === "0") {
//       const settings = await tx.setting.findFirst();
//       const commission = settings?.commission || 0;
//       const commissionAmount = (Number(commission) / 100) * depositAmount;

//       const referrer = await tx.user.findUnique({
//         where: { inviteCode: user.invitedBy },
//         include: { profile: true },
//       });

//       if (referrer?.profile) {
//         await tx.profile.update({
//           where: { userId: referrer.id },
//           data: {
//             currentBalance: { increment: commissionAmount },
//           },
//         });

//         await tx.transaction.create({
//           data: {
//             type: "COMMISSION",
//             amount: commissionAmount,
//             userId: referrer.id,
//           },
//         });
//       }
//     }

//     return {
//       vipUpgraded: shouldUpgradeVip,
//       vipLevel:
//         shouldUpgradeVip && highestAffordableVip
//           ? highestAffordableVip.name
//           : userProfile.vipName,
//       vipPrice:
//         vipTransactionCreated && highestAffordableVip
//           ? highestAffordableVip.price
//           : 0,
//       finalBalance,
//       vipTransactionCreated,
//     };
//   } catch (error) {
//     console.error("Error in handleDepositCompletion:", error);
//     throw error;
//   }
// };

const handleDepositCompletion = async (
  tx: any,
  user: any,
  userProfile: any,
  order: any,
) => {
  try {
    // IDEMPOTENCY CHECK - Still need this first
    const existingDepositTransaction = await tx.transaction.findFirst({
      where: {
        userId: user.id,
        orderId: order.id,
        type: "DEPOSIT",
      },
    });

    if (existingDepositTransaction) {
      console.log(
        `Deposit for order ${order.id} already processed, skipping...`,
      );
      return {
        alreadyProcessed: true,
        finalBalance: userProfile.currentBalance,
        vipLevel: userProfile.vipName,
        vipUpgraded: false,
        vipPrice: 0,
        vipTransactionCreated: false,
      };
    }

    // RUN ALL READ OPERATIONS IN PARALLEL
    const [allVips, existingVipTransactions, settings] = await Promise.all([
      tx.vip.findMany({ orderBy: { price: "asc" } }),
      tx.transaction.findMany({
        where: {
          userId: user.id,
          type: "VIP",
        },
      }),
      tx.setting.findFirst(), // Get settings early
    ]);

    if (!allVips.length) {
      throw new Error("No VIPs found");
    }

    const currentVip = allVips.find((v: any) => v.name === userProfile.vipName);
    const currentVipPrice = currentVip ? currentVip.price : 0;
    const currentVipLevel = Number(userProfile.vipName || "0");

    const currentBalance = Number(userProfile.currentBalance);
    const depositAmount = Number(order.amount);
    const newBalance = currentBalance + depositAmount;
    const calculatedBalance = newBalance + currentVipPrice;

    const hasPurchasedAnyVip = existingVipTransactions.length > 0;

    const affordableVips = allVips.filter(
      (v: { price: number; name: string }) => v.price <= calculatedBalance,
    );

    const highestAffordableVip =
      affordableVips.sort(
        (a: { price: number }, b: { price: number }) => b.price - a.price,
      )[0] || null;

    let finalBalance = newBalance;
    let vipTransactionCreated = false;
    let shouldUpgradeVip = false;

    // COLLECT ALL WRITE OPERATIONS TO RUN IN PARALLEL
    const writeOperations = [];

    // Handle VIP upgrade logic
    if (highestAffordableVip) {
      const highestVipLevel = Number(highestAffordableVip.name);

      if (highestVipLevel > currentVipLevel) {
        shouldUpgradeVip = true;
        finalBalance = calculatedBalance - highestAffordableVip.price;

        writeOperations.push(
          tx.transaction.create({
            data: {
              type: "VIP",
              amount: highestAffordableVip.price,
              userId: user.id,
              orderId: order.id,
            },
          }),
        );

        vipTransactionCreated = true;
      } else if (
        highestVipLevel === currentVipLevel &&
        !hasPurchasedAnyVip &&
        highestAffordableVip.price > 0
      ) {
        shouldUpgradeVip = true;
        finalBalance = calculatedBalance - highestAffordableVip.price;

        writeOperations.push(
          tx.transaction.create({
            data: {
              type: "VIP",
              amount: highestAffordableVip.price,
              userId: user.id,
              orderId: order.id,
            },
          }),
        );

        vipTransactionCreated = true;
      }
    }

    // Prepare profile update
    const profileUpdateData: any = {
      currentBalance: finalBalance,
      totalDeposit: { increment: depositAmount },
    };

    if (shouldUpgradeVip && highestAffordableVip) {
      profileUpdateData.vipName = highestAffordableVip.name;
    }

    writeOperations.push(
      tx.profile.update({
        where: { userId: user.id },
        data: profileUpdateData,
      }),
    );

    // Add deposit transaction
    writeOperations.push(
      tx.transaction.create({
        data: {
          type: "DEPOSIT",
          amount: depositAmount,
          userId: user.id,
          orderId: order.id,
        },
      }),
    );

    // Handle user status update if needed
    if (user.status === "0") {
      writeOperations.push(
        tx.user.update({
          where: { id: user.id },
          data: { status: "1" },
        }),
      );
    }

    // Handle referral commission (3-level)
    if (user.invitedBy && user.status === "0") {
      const settings = await tx.setting.findFirst();

      // Only process if settings exist
      if (settings) {
        const commissionPercent = Number(settings.commission || 0);
        const commission2Percent = Number(settings.commission2 || 0);
        const commission3Percent = Number(settings.commission3 || 0);

        const depositAmount = Number(order.amount);

        // Calculate commission amounts
        const commissionAmount = (commissionPercent / 100) * depositAmount;
        const commission2Amount = (commission2Percent / 100) * depositAmount;
        const commission3Amount = (commission3Percent / 100) * depositAmount;

        // Track users at each level
        let level1Referrer = null;
        let level2Referrer = null;
        let level3Referrer = null;

        // Find level 1 (direct referrer)
        if (user.invitedBy) {
          level1Referrer = await tx.user.findUnique({
            where: { inviteCode: user.invitedBy },
            include: { profile: true },
          });

          // Find level 2 (referrer's referrer)
          if (level1Referrer?.invitedBy) {
            level2Referrer = await tx.user.findUnique({
              where: { inviteCode: level1Referrer.invitedBy },
              include: { profile: true },
            });

            // Find level 3 (referrer's referrer's referrer)
            if (level2Referrer?.invitedBy) {
              level3Referrer = await tx.user.findUnique({
                where: { inviteCode: level2Referrer.invitedBy },
                include: { profile: true },
              });
            }
          }
        }

        // Process level 1 commission (direct referrer)
        if (level1Referrer?.profile && commissionAmount > 0) {
          // Check if commission already given for this order
          const existingCommission = await tx.transaction.findFirst({
            where: {
              userId: level1Referrer.id,
              orderId: order.id,
              type: "COMMISSION",
              level: 1,
            },
          });

          if (!existingCommission) {
            writeOperations.push(
              tx.profile.update({
                where: { userId: level1Referrer.id },
                data: {
                  currentBalance: { increment: commissionAmount },
                  totalCommission: { increment: commissionAmount },
                },
              }),
            );

            writeOperations.push(
              tx.transaction.create({
                data: {
                  type: "COMMISSION",
                  amount: commissionAmount,
                  userId: level1Referrer.id,
                  orderId: order.id,
                  level: 1,
                  description: `Level 1 commission from user ${user.id}`,
                },
              }),
            );
          }
        }

        // Process level 2 commission (grandfather)
        if (level2Referrer?.profile && commission2Amount > 0) {
          const existingCommission2 = await tx.transaction.findFirst({
            where: {
              userId: level2Referrer.id,
              orderId: order.id,
              type: "COMMISSION",
              level: 2,
            },
          });

          if (!existingCommission2) {
            writeOperations.push(
              tx.profile.update({
                where: { userId: level2Referrer.id },
                data: {
                  currentBalance: { increment: commission2Amount },
                  totalCommission: { increment: commission2Amount },
                },
              }),
            );

            writeOperations.push(
              tx.transaction.create({
                data: {
                  type: "COMMISSION",
                  amount: commission2Amount,
                  userId: level2Referrer.id,
                  orderId: order.id,
                  level: 2,
                  description: `Level 2 commission from user ${user.id}`,
                },
              }),
            );
          }
        }

        // Process level 3 commission (great grandfather)
        if (level3Referrer?.profile && commission3Amount > 0) {
          const existingCommission3 = await tx.transaction.findFirst({
            where: {
              userId: level3Referrer.id,
              orderId: order.id,
              type: "COMMISSION",
              level: 3,
            },
          });

          if (!existingCommission3) {
            writeOperations.push(
              tx.profile.update({
                where: { userId: level3Referrer.id },
                data: {
                  currentBalance: { increment: commission3Amount },
                  totalCommission: { increment: commission3Amount },
                },
              }),
            );

            writeOperations.push(
              tx.transaction.create({
                data: {
                  type: "COMMISSION",
                  amount: commission3Amount,
                  userId: level3Referrer.id,
                  orderId: order.id,
                  level: 3,
                  description: `Level 3 commission from user ${user.id}`,
                },
              }),
            );
          }
        }
      }
    }

    // RUN ALL WRITE OPERATIONS IN PARALLEL
    await Promise.all(writeOperations);

    return {
      vipUpgraded: shouldUpgradeVip,
      vipLevel:
        shouldUpgradeVip && highestAffordableVip
          ? highestAffordableVip.name
          : userProfile.vipName,
      vipPrice:
        vipTransactionCreated && highestAffordableVip
          ? highestAffordableVip.price
          : 0,
      finalBalance,
      vipTransactionCreated,
      alreadyProcessed: false,
    };
  } catch (error) {
    console.error("Error in handleDepositCompletion:", error);
    throw error;
  }
};
const handleFundDepositCompletion = async (
  tx: any,
  user: any,
  userProfile: any,
  order: any,
) => {
  try {
    const currentFundBalance = Number(userProfile.fundIncome);
    const depositAmount = Number(order.amount);

    // set withdraw date to 7 days later
    const nextFundWithdrawDate = new Date();
    nextFundWithdrawDate.setDate(nextFundWithdrawDate.getDate() + 15);
    // const nextWithdrawDate = nextFundWithdrawDate.toISOString();

    if (currentFundBalance !== 0) {
      // If user already has fund income, do not create new transaction or update profile
      return {
        fundUpdated: false,
        fundAmount: 0,
      };
    }

    // currentFundBalance not equal to zero
    if (currentFundBalance === 0) {
      await tx.transaction.create({
        data: {
          type: "FUND_D",
          amount: depositAmount,
          userId: user.id,
        },
      });

      await tx.profile.update({
        where: { userId: user.id },
        data: {
          fundIncome: depositAmount,
          NextFundWithdraw: nextFundWithdrawDate,
        },
      });
    }

    return {
      fundUpdated: true,
      fundAmount: depositAmount,
    };
  } catch (error) {
    console.error("Error in handleDepositCompletion:", error);
    throw error;
  }
};
