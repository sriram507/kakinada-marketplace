import { Router } from "express";
import { applyAsSeller, getPendingSellers, approveSeller } from "../controllers/sellerController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/apply", protect, applyAsSeller);
router.get("/pending", protect, authorize("admin"), getPendingSellers);
router.patch("/:id/approve", protect, authorize("admin"), approveSeller);

export default router;