import { Router } from "express";
import {
  applyAsSeller,
  getPendingSellers,
  approveSeller,
  getPublicSellers,
} from "../controllers/sellerController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/public", getPublicSellers);

router.post("/apply", protect, applyAsSeller);
router.get("/pending", protect, authorize("admin"), getPendingSellers);
router.patch("/:id/approve", protect, authorize("admin"), approveSeller);

export default router;