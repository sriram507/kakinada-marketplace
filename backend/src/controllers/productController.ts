import { Request, Response } from "express";
import { Types } from "mongoose";
import { Product } from "../models/Product";
import { Seller } from "../models/Seller";
import { AuthRequest } from "../middleware/authMiddleware";

const getOwnSellerProfile = async (userId: string) => {
  return Seller.findOne({ userId, isApproved: true });
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getOwnSellerProfile(req.user!.id);
    if (!seller) {
      res.status(403).json({ message: "No approved seller profile found for this account" });
      return;
    }

    const { name, description, price, stock, category, imageUrl } = req.body;

    if (!name || !description || price === undefined || !category) {
      res.status(400).json({ message: "name, description, price, and category are required" });
      return;
    }

    const product = await Product.create({
      sellerId: seller._id,
      name,
      description,
      price,
      stock: stock ?? 0,
      category,
      imageUrl: imageUrl ?? "",
    });

    res.status(201).json({ message: "Product created, pending admin approval", product });
  } catch (error) {
    res.status(500).json({ message: "Product creation failed", error: (error as Error).message });
  }
};

export const getMyProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getOwnSellerProfile(req.user!.id);
    if (!seller) {
      res.status(403).json({ message: "No approved seller profile found for this account" });
      return;
    }

    const products = await Product.find({ sellerId: seller._id });
    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: (error as Error).message });
  }
};

export const updateMyProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getOwnSellerProfile(req.user!.id);
    if (!seller) {
      res.status(403).json({ message: "No approved seller profile found for this account" });
      return;
    }

    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.sellerId.toString() !== (seller._id as Types.ObjectId).toString()) {
      res.status(403).json({ message: "You do not own this product" });
      return;
    }

    const { name, description, price, stock, category, imageUrl, isActive } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (isActive !== undefined) product.isActive = isActive;
    // isApproved is deliberately never read from the request body

    await product.save();

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: (error as Error).message });
  }
};

export const getPendingProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pending = await Product.find({ isApproved: false }).populate("sellerId", "shopName");
    res.status(200).json({ count: pending.length, products: pending });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending products", error: (error as Error).message });
  }
};

export const approveProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    product.isApproved = true;
    await product.save();

    res.status(200).json({ message: "Product approved", product });
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error: (error as Error).message });
  }
};

export const getPublicProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = "1", limit = "20" } = req.query;

    const filter: Record<string, unknown> = { isApproved: true, isActive: true };

    if (category && typeof category === "string") {
      filter.category = category;
    }

    if (search && typeof search === "string") {
      filter.name = { $regex: search, $options: "i" };
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("sellerId", "shopName")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: (error as Error).message });
  }
};

export const getPublicProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      isApproved: true,
      isActive: true,
    }).populate("sellerId", "shopName address");

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: (error as Error).message });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct("category", { isApproved: true, isActive: true });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: (error as Error).message });
  }
};