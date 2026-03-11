// src/routes/index.ts
import { Router } from "express";
import { adminRouter } from "./adminRoute";
import { systemRouter } from "./settingRoute";
import { authRouter } from "./authRoute";
import { userRouter } from "./userRoute";

const router = Router();

// Health checks
// router.use("/admin", healthRoutes);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/system", systemRouter);
router.use("/user", userRouter);
// router.use("/vip", healthRoutes);
// router.use("/auth", healthRoutes);

// Sync management

// Default route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      sync: "/sync",
    },
  });
});

export default router;
