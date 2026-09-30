import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrderById,
} from "../controllers/orderController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/seller", protect, authorize("seller"), getSellerOrders);
router.get("/:id", protect, getOrderById); // wildcard route stays last

export default router;