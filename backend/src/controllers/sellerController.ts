import { Response } from "express";
import { Seller } from "../models/Seller";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

export const applyAsSeller = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopName, address, phone, category } = req.body;

    if (!shopName || !address || !phone || !category) {
      res.status(400).json({ message: "shopName, address, phone, and category are required" });
      return;
    }

    const existingApplication = await Seller.findOne({ userId: req.user!.id });
    if (existingApplication) {
      res.status(409).json({ message: "Seller application already exists for this account" });
      return;
    }

    const seller = await Seller.create({ userId: req.user!.id, shopName, address, phone, category });

    res.status(201).json({ message: "Seller application submitted, pending admin approval", seller });
  } catch (error) {
    res.status(500).json({ message: "Application failed", error: (error as Error).message });
  }
};

export const getPendingSellers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pending = await Seller.find({ isApproved: false }).populate("userId", "name email");
    res.status(200).json({ count: pending.length, sellers: pending });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending sellers", error: (error as Error).message });
  }
};

export const approveSeller = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);
    if (!seller) {
      res.status(404).json({ message: "Seller application not found" });
      return;
    }

    seller.isApproved = true;
    await seller.save();

    await User.findByIdAndUpdate(seller.userId, { role: "seller" });

    res.status(200).json({ message: "Seller approved", seller });
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error: (error as Error).message });
  }
};