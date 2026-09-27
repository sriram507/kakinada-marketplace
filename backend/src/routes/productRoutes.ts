import { Router } from "express";
import {
  createProduct,
  getMyProducts,
  updateMyProduct,
  getPendingProducts,
  approveProduct,
  getPublicProducts,
  getPublicProductById,
  getCategories,
} from "../controllers/productController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

// Public routes — no login required
router.get("/public", getPublicProducts);
router.get("/public/:id", getPublicProductById);
router.get("/categories", getCategories);

// Seller routes
router.post("/", protect, authorize("seller"), createProduct);
router.get("/mine", protect, authorize("seller"), getMyProducts);
router.patch("/:id", protect, authorize("seller"), updateMyProduct);

// Admin routes
router.get("/pending", protect, authorize("admin"), getPendingProducts);
router.patch("/:id/approve", protect, authorize("admin"), approveProduct);

export default router;