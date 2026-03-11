// src/routes/systemRoute.ts
import { Router } from "express";
import { systemController } from "../controllers/systemController";
import { authenticate } from "../middleware/auth";
import {
  bankController,
  settingController,
  taskInfoController,
  vipController,
} from "../controllers/settingController";

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Configure multer storage for system images
// Fix the multer destination to match your static serving
const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const folder = "/uploads/system";
    const dir = path.join(__dirname, `../${folder}`);

    fs.mkdir(dir, { recursive: true }, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error("Error creating upload directory:", err);
        return cb(
          new Error(`Failed to create upload directory: ${err.message}`),
          ""
        );
      }
      cb(null, dir);
    });
  },

  filename: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Define routes BEFORE exporting
router.get("/setting", systemController.getSetting);
router.get("/banks", authenticate, systemController.getBanks);
router.get("/all", authenticate, systemController.getVip);
router.get("/taskInfo", systemController.getTaskInfo);

// Bank routes
router.get(
  "/banks",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  bankController.getAllBanks,
);
router.post(
  "/banks",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  bankController.createBank,
);
router.put(
  "/banks/:id",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  bankController.updateBank,
);
router.delete("/banks/:id", bankController.deleteBank);

// Settings routes
router.get("/settings", settingController.getSettings);
router.post("/settings", settingController.updateSettings);

// TaskInfo routes with file upload
router.get("/task-info", taskInfoController.getAllTaskInfo);
router.post(
  "/task-info",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  taskInfoController.createTaskInfo
);
router.put(
  "/task-info/:id",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  taskInfoController.updateTaskInfo
);
router.delete("/task-info/:id", taskInfoController.deleteTaskInfo);

// VIP routes with file upload
router.get("/vips", vipController.getAllVips);
router.post(
  "/vips",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  vipController.createVip
);
router.put(
  "/vips/:id",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  vipController.updateVip
);
router.delete("/vips/:id", vipController.deleteVip);

export const systemRouter = router;
