// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signToken, verifyToken } from "../lib/jwt";
import { AuthRequest } from "../middleware/auth";

export interface ProfileUpdateInput {
  referralIncome?: number;
}

function generateInviteCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authController = {
  // ✅ user registration - ALREADY GOOD! Just minor select optimization
  register: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { phone, password, inviteCode,name } = req.body;

      // Validate required fields
      if (!phone || !password) {
        return res.status(400).json({
          error: "Phone and password are required",
          success: false,
        });
      }

      // Use transaction for atomic operations
      const result = await prisma.$transaction(async (tx) => {
        // Check if phone exists - only select id for efficiency
        const existingUser = await tx.user.findUnique({
          where: { phone },
          select: { id: true }, // Only need to know if exists
        });

        if (existingUser) {
          throw new Error("Phone already registered");
        }

        // Handle inviter validation
        let inviter = null;
        if (inviteCode?.trim()) {
          inviter = await tx.user.findUnique({
            where: { inviteCode: inviteCode.trim() },
            select: {
              id: true,
              inviteCode: true,
              phone: true,
            }, // Only select what we need
          });

          if (!inviter) {
            throw new Error("Invalid invitation code");
          }
        }

        // Generate unique invite code
        const newInviteCode = await generateUniqueInviteCode(tx); // Pass transaction

        // Get default VIP - only select name
        const defaultVip = await tx.vip.findFirst({
          orderBy: { id: "asc" },
          select: { name: true }, // Only need the name
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with profile
        const newUser = await tx.user.create({
          data: {
            phone,
            name:name||null,
            password: hashedPassword,
            inviteCode: newInviteCode,
            invitedBy: inviter?.inviteCode || null,
            invitedAt: inviter ? new Date() : null,
            profile: {
              create: {
                currentBalance: 0,
                vipName: defaultVip?.name || null,
                referralIncome: 0,
              },
            },
          },
          select: {
            // Use select instead of include for better performance
            id: true,
            phone: true,
            role: true,
            inviteCode: true,
            profile: {
              select: {
                currentBalance: true,
                vipName: true,
                referralIncome: true,
              },
            },
          },
        });

        // If you want to enable referral income later, uncomment this
        // if (inviter) {
        //   await tx.profile.update({
        //     where: { userId: inviter.id },
        //     data: { referralIncome: { increment: 1000 } },
        //   });
        // }

        return { newUser, inviter };
      });

      // Generate JWT
      const token = signToken({
        id: result.newUser.id,
        phone: result.newUser.phone,
        role: result.newUser.role,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        yourInviteCode: result.newUser.inviteCode,
        referralFrom: result.inviter?.phone || null,
        profile: result.newUser.profile, // Include profile data
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Registration failed",
        success: false,
      });
    }
  },

  // ✅ user login - MINOR OPTIMIZATIONS
  signIn: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({
          error: "Phone and password are required",
          success: false,
        });
      }

      // Find user with profile in ONE query (better UX)
      const user = await prisma.user.findUnique({
        where: { phone },
        select: {
          id: true,
          phone: true,
          name: true,
          password: true,
          role: true,
          status: true,
          inviteCode: true,
          profile: {
            select: {
              currentBalance: true,
              vipName: true,
              referralIncome: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(400).json({
          error: "Invalid phone number",
          success: false,
        });
      }

      // Check if account is active
      // if (user.status === "0") {
      //   return res.status(403).json({
      //     error: "Account not activated. Please contact support.",
      //     success: false,
      //   });
      // }

      // Compare password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          error: "Invalid password",
          success: false,
        });
      }

      // Generate JWT
      const token = signToken({
        id: user.id,
        phone: user.phone,
        role: user.role,
        name: user.name,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
        success: true,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        error: "Internal server error",
        success: false,
      });
    }
  },

  // ✅ changePassword - MINOR OPTIMIZATIONS
  changePassword: async (
    req: AuthRequest,
    res: Response,
  ): Promise<Response> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userId;

      // Validate inputs
      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
          success: false,
        });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Missing currentPassword or newPassword",
          success: false,
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "New password must be at least 6 characters",
          success: false,
        });
      }

      // Use transaction for consistency
      await prisma.$transaction(async (tx) => {
        // Get user with password
        const existingUser = await tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            password: true,
          },
        });

        if (!existingUser) {
          throw new Error("User not found");
        }

        // Check current password
        const isCurrentPasswordValid = await bcrypt.compare(
          currentPassword,
          existingUser.password,
        );

        if (!isCurrentPasswordValid) {
          throw new Error("Invalid current password");
        }

        // Prevent using the same password
        const isSamePassword = await bcrypt.compare(
          newPassword,
          existingUser.password,
        );

        if (isSamePassword) {
          throw new Error(
            "New password must be different from current password",
          );
        }

        // Hash new password (using 12 rounds for better security)
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await tx.user.update({
          where: { id: userId },
          data: { password: hashedPassword },
          select: { id: true },
        });
      });

      return res.json({
        message: "Password updated successfully",
        success: true,
      });
    } catch (err) {
      console.error("Change password error:", err);

      if (err instanceof Error) {
        const status =
          err.message === "User not found"
            ? 404
            : err.message === "Invalid current password"
              ? 401
              : err.message ===
                  "New password must be different from current password"
                ? 400
                : 500;

        return res.status(status).json({
          error: err.message,
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

// OPTIMIZED: generateUniqueInviteCode with transaction support
async function generateUniqueInviteCode(
  tx?: any,
  maxAttempts = 10,
): Promise<string> {
  const client = tx || prisma; // Use transaction if provided, otherwise fallback to prisma

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateInviteCode();
    const exists = await client.user.findUnique({
      where: { inviteCode: code },
      select: { id: true }, // Only select id for efficiency
    });

    if (!exists) return code;
  }

  throw new Error("Failed to generate unique invite code");
}
