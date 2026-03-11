// src/routes/adminRoute.ts
import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { authenticate } from "../middleware/auth";

const router = Router();

// ✅ Define routes BEFORE exporting
router.get("/users", authenticate, adminController.getUsers);
router.get("/users/details/:id", authenticate, adminController.getUserDetails);
router.get("/users/info", authenticate, adminController.userInfo);
router.get("/orders", authenticate, adminController.userOrders);
router.put("/order/approve", authenticate, adminController.approveOrder);
router.delete("/user/:id", authenticate, adminController.deleteUser);

export const adminRouter = router;
