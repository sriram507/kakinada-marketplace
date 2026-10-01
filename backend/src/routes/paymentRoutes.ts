import { Router } from "express";
import { verifyPayment } from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/verify", protect, verifyPayment);

export default router;