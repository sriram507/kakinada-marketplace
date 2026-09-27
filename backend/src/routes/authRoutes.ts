import { Router } from "express";
import { register, login } from "../controllers/authController";
import { protect, authorize, AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Temporary test route — confirms protect + authorize work
router.get("/me", protect, (req: AuthRequest, res: Response) => {
  res.status(200).json({ user: req.user });
});

router.get("/admin-only", protect, authorize("admin"), (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: "Welcome, admin" });
});

export default router;