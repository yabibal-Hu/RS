import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  // const inserted = await prisma.taskInfo.createMany({
  //   data: [
  //     {
  //       taskId: "1",
  //       taskName: "Info for Task 1",
  //       description: "Description for Task 1",
  //       logoDir: "logo1.png",
  //       incomePerTask: 100,
  //     },
  //     {
  //       taskId: "2",
  //       taskName: "Info for Task 1",
  //       description: "Description for Task 1",
  //       logoDir: "logo1.png",
  //       incomePerTask: 101,
  //     },
  //     {
  //       taskId: "3",
  //       taskName: "Info for Task 1",
  //       description: "Description for Task 1",
  //       logoDir: "logo1.png",
  //       incomePerTask: 102,
  //     },
  //   ],
  // });
  // console.log("Inserted:", inserted);
  
  const inserted2 = await prisma.setting.create({
    data: {
      commission: "10",
      minWithdraw: 1000,
      maxWithdraw: 5000,
      minDeposit: 1000,
      maxDeposit: 5000,
      dallyWithdrawLimitAmount: 5000,
      dallyWithdrawLimit: 5000,
      dallyDepositLimitAmount: 5000,
      dallyDepositLimit: 5000,
    },
  });
  console.log("Inserted:", inserted2);

  // const inserted3 = await prisma.bank.createMany({
  //   data: [
  //     {
  //       bankName: "Awash Bank",
  //       accNumber: "1234567890",
  //       owner: "Abebe Kebede",
  //       status: "BOTH",
  //     },
  //     {
  //       bankName: "CBE Bank",
  //       accNumber: "1234567890",
  //       owner: "Abebe Kebede",
  //       status: "BOTH",
  //     },
  //     {
  //       bankName: "Bank of Abyssinia",
  //       accNumber: "1234567890",
  //       owner: "Abebe Kebede",
  //       status: "BOTH",
  //     },
  //   ],
  // });
  // console.log("Inserted:", inserted3);
  // const inserted4 = await prisma.vip.createMany({
  //   data: [
  //     {
  //       name: "0",
  //       description: "Free",
  //       logoDir: "logo1.png",
  //       dailyIncome: 0,
  //       commission: 0,
  //       price: 0,
  //       incomePerTask: 0,
  //     },
  //     {
  //       name: "1",
  //       description: "Beginner",
  //       logoDir: "logo1.png",
  //       dailyIncome: 16,
  //       commission: 70,
  //       price: 1000,
  //       incomePerTask: 50,
  //     },
  //     {
  //       name: "2",
  //       description: "Intermediate",
  //       logoDir: "logo1.png",
  //       dailyIncome: 26,
  //       commission: 80,
  //       price: 2000,
  //       incomePerTask: 80,
  //     },
  //     {
  //       name: "3",
  //       description: "Advanced",
  //       logoDir: "logo1.png",
  //       dailyIncome: 16,
  //       commission: 70,
  //       price: 3000,
  //       incomePerTask: 100,
  //     },
  //     {
  //       name: "4",
  //       description: "Master",
  //       logoDir: "logo1.png",
  //       dailyIncome: 26,
  //       commission: 80,
  //       price: 4000,
  //       incomePerTask: 150,
  //     },
  //     {
  //       name: "5",
  //       description: "Expert",
  //       logoDir: "logo1.png",
  //       dailyIncome: 36,
  //       commission: 90,
  //       price: 5000,
  //       incomePerTask: 200,
  //     },
  //     {
  //       name: "6",
  //       description: "Master",
  //       logoDir: "logo1.png",
  //       dailyIncome: 46,
  //       commission: 100,
  //       price: 6000,
  //       incomePerTask: 250,
  //     },
  //     {
  //       name: "7",
  //       description: "Expert",
  //       logoDir: "logo1.png",
  //       dailyIncome: 56,
  //       commission: 110,
  //       price: 7000,
  //       incomePerTask: 300,
  //     },
     
  //   ],
  // });
  // console.log("Inserted:", inserted4);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
