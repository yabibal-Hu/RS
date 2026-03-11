// src/routes/authRoute.ts
import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

// ✅ Define routes BEFORE exporting
router.post("/register", authController.register);
router.post("/login", authController.signIn);
router.put("/password", authenticate, authController.changePassword);

export const authRouter = router;



// const router = Router();
// export const usersRouter = router;
// usersRouter.post("/patientDistribution", authController.register);