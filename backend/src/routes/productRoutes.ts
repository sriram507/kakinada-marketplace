import { Router } from "express";
import {
  createProduct,
  getMyProducts,
  updateMyProduct,
  getPendingProducts,
  approveProduct,
} from "../controllers/productController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, authorize("seller"), createProduct);
router.get("/mine", protect, authorize("seller"), getMyProducts);
router.patch("/:id", protect, authorize("seller"), updateMyProduct);

router.get("/pending", protect, authorize("admin"), getPendingProducts);
router.patch("/:id/approve", protect, authorize("admin"), approveProduct);

export default router;