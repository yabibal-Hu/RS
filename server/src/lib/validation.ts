// import { z } from "zod";

// export const registerSchema = z
//   .object({
//     phone: z.string().regex(/^\d{9,15}$/, "Phone must be 9–15 digits"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string(),
//     inviteCode: z.string().max(6, "Invalid invitation code").optional(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords must match",
//     path: ["confirmPassword"],
//   });

// export const loginSchema = z.object({
//   phone: z.string().regex(/^\d{9,15}$/, "Invalid phone number"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// // no enough balance
// export const upgradeVIP = z.object({ balance: z.number().min(1) });