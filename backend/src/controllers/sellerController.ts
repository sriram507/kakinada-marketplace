import { Request, Response } from "express";
import { Seller } from "../models/Seller";
import { Product } from "../models/Product";
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

    const seller = await Seller.create({
      userId: req.user!.id,
      shopName,
      address,
      phone,
      category,
    });

    res.status(201).json({
      message: "Seller application submitted, pending admin approval",
      seller,
    });
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

export const getPublicSellers = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellers = await Seller.find({ isApproved: true }).select("shopName category address");

    const counts = await Product.aggregate([
      { $match: { isApproved: true, isActive: true } },
      { $group: { _id: "$sellerId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const result = sellers
      .map((s) => ({
        _id: s._id,
        shopName: s.shopName,
        category: s.category,
        address: s.address,
        productCount: countMap.get((s._id as unknown as string).toString()) || 0,
      }))
      .filter((s) => s.productCount > 0)
      .sort((a, b) => b.productCount - a.productCount);

    res.status(200).json({ sellers: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sellers", error: (error as Error).message });
  }
};