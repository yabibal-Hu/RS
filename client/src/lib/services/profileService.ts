// import { prisma } from "@/lib/prisma";

// export const profileService = {
//   async getUserProfile(userId: string) {
//     return prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         phone: true,
//         name: true,
//         role: true,
//         inviteCode: true,
//         invitedBy: true,
//         invitedAt: true,
//         createdAt: true,
//         profile: {
//           select: {
//             currentBalance: true,
//             vip: {
//               select: {
//                 name: true,
//                 dailyIncome: true,
//                 incomePerTask: true,
//                 commission: true,
//               },
//             },
//           },
//         },
//       },
//     });
//   },
// };
