// import { prisma } from "@/lib/prisma";

// export const taskService = {
//   async getUserTaskInfo(userId: string, timeIsUp: boolean) {
//     // if timeIsUp is true update all taskStatus to 0
//     if (timeIsUp) {
//       await prisma.task.updateMany({
//         where: {
//           userId,
//         },
//         data: {
//           status: "0",
//         },
//       });
//     }

//     return await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         profile: {
//           select: {
//             currentBalance: false,
//             vip: {
//               select: {
//                 name: true,
//                 dailyIncome: true,
//                 incomePerTask: true,
//                 commission: true,
//               },
//             },
//             taskStatus: true,
//           },
//         },
//         task: {
//           select: {
//             id: true,
//             taskInfoId: true,
//             status: true,
//             updatedAt: true,
//           },
//         },
//       },
//     });
//     ;
//   },

//   async makeTask(userId: string, body:{ taskInfoId: string }) {
//     const { taskInfoId } = body;
//     const id = Number(taskInfoId);

//     try {
//       // 1. Get user's VIP information first
//       const userWithVip = await prisma.user.findUnique({
//         where: { id: userId },
//         include: {
//           profile: {
//             include: {
//               vip: true,
//             },
//           },
//         },
//       });

//       if (!userWithVip?.profile) {
//         throw new Error("User profile not found");
//       }

//       const incomePerTask = userWithVip.profile.vip?.incomePerTask || 0;

//       // 2. Check for existing task
//       const existingTask = await prisma.task.findUnique({
//         where: {
//           userId_taskInfoId: { userId, taskInfoId: id },
//         },
//       });

//       if (existingTask) {
//         if (existingTask.status === "0") {
//           // Use transaction to ensure both operations succeed or fail together
//           return await prisma.$transaction([
//             // Update task status
//             prisma.task.update({
//               where: { userId_taskInfoId: { userId, taskInfoId: id } },
//               data: { status: "1" },
//             }),
//             // Increment user balance
//             prisma.profile.update({
//               where: { userId },
//               data: {
//                 currentBalance: { increment: incomePerTask },
//                 totalIncome: { increment: incomePerTask },
//               },
//             }),
//             // Create transaction record
//             prisma.transaction.create({
//               data: {
//                 userId,
//                 type: "TASK",
//                 amount: incomePerTask,
//               },
//             }),
//           ]);
//         }
//         throw new Error("You've already completed this task today");
//       }

//       // For new task creation with balance increment
//       return await prisma.$transaction([
//         // Create new task
//         prisma.task.create({
//           data: {
//             userId,
//             taskInfoId: id,
//             status: "1",
//           },
//         }),
//         // Increment user balance
//         prisma.profile.update({
//           where: { userId },
//           data: {
//             currentBalance: { increment: incomePerTask },
//             totalIncome: { increment: incomePerTask },
//           },
//         }),
//         // Create transaction record
//         prisma.transaction.create({
//           data: {
//             userId,
//             type: "TASK",
//             amount: incomePerTask,
//           },
//         }),
//       ]);
//     } catch (error) {
//       // console.error("Task completion error:", error);

//       if (error instanceof Error) {

//         throw new Error(error.message || "Failed to process task");
//       }

//     }
//   },
// };
