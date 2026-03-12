// src/routes/userRoute.ts
// import { Router } from "express";
import {  usersController } from "../controllers/userController";
import { authenticate } from "../middleware/auth";
// import { uploadReceipt } from "../middleware/cloudinaryUpload";
import { uploadReceiptMemory } from "../utils/cloudinaryUpload";

const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

const router = express.Router();

// Configure multer storage
// const storage = multer.diskStorage({
//   destination: (
//     req: Express.Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) => {
//     const folder = "/uploads/order";
//     const dir = path.join(__dirname, `../${folder}`);

//     fs.mkdir(dir, { recursive: true }, (err: NodeJS.ErrnoException | null) => {
//       if (err) {
//         console.error("Error creating upload directory:", err);
//         return cb(
//           new Error(`Failed to create upload directory: ${err.message}`),
//           ""
//         );
//       }
//       cb(null, dir);
//     });
//   },

//   filename: (
//     req: Express.Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, filename: string) => void
//   ) => {
//     const uniqueName = `${Date.now()}_${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// const router = Router();

// ✅ Define routes BEFORE exporting
router.post("/username", usersController.updateName);
router.get("/info", authenticate, usersController.profile);
router.get("/balance", authenticate, usersController.balance);
router.post(
  "/deposit/balance",
  authenticate,
  uploadReceiptMemory,
  usersController.deposit,
);
router.get("/deposit/orders", authenticate, usersController.depositOrders);
router.get("/referral/info", authenticate, usersController.referrals);
router.post("/withdraw/balance", authenticate, usersController.withdraw);
router.post("/withdraw/fund", authenticate, usersController.withdrawFunds);
router.get("/withdraw/orders", authenticate, usersController.withdrawOrders);
router.get("/vip/update", usersController.vip);
router.post("/task/make", authenticate, usersController.makeTask);
router.get("/task/info", authenticate, usersController.taskInfo);
router.get("/fund/orders", authenticate, usersController.fundOrders);
router.get("/referral/network", authenticate, usersController.getReferralStats);
// router.post(
//   "/deposit/balance",
//   authenticate,
//   upload.single("receipt"),
//   usersController.deposit,
// );
export const userRouter = router;

// src/routes/userRoute.ts

// const router = Router();
// export const usersRouter = router;
// usersRouter.post("/patientDistribution", usersController.register);
