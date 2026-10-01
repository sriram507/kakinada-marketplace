import { Response } from "express";
import { Types } from "mongoose";
import { Product } from "../models/Product";
import { Seller } from "../models/Seller";
import { Order, IOrderItem } from "../models/Order";
import { AuthRequest } from "../middleware/authMiddleware";
import { COMMISSION_RATE, DELIVERY_CHARGE } from "../config/businessRules";
import { getPaymentService } from "../services/payment";

interface CartItemInput {
  productId: string;
  quantity: number;
}

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, deliveryAddress, deliveryPhone, paymentMethod } = req.body as {
      items: CartItemInput[];
      deliveryAddress: string;
      deliveryPhone: string;
      paymentMethod: "cod" | "online";
    };

    if (!items || items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    if (!deliveryAddress || !deliveryPhone) {
      res.status(400).json({ message: "Delivery address and phone are required" });
      return;
    }

    if (paymentMethod !== "cod" && paymentMethod !== "online") {
      res.status(400).json({ message: "paymentMethod must be 'cod' or 'online'" });
      return;
    }

    const orderItems: IOrderItem[] = [];
    let itemsTotal = 0;

    // Step 1: validate every item and build server-trusted order items
    for (const cartItem of items) {
      const product = await Product.findOne({
        _id: cartItem.productId,
        isApproved: true,
        isActive: true,
      });

      if (!product) {
        res.status(404).json({
          message: `Product not available: ${cartItem.productId}`,
        });
        return;
      }

      if (cartItem.quantity < 1) {
        res.status(400).json({ message: `Invalid quantity for ${product.name}` });
        return;
      }

      if (product.stock < cartItem.quantity) {
        res.status(409).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
        return;
      }

      orderItems.push({
        sellerId: product.sellerId,
        productId: product._id as unknown as IOrderItem["productId"],
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
      });

      itemsTotal += product.price * cartItem.quantity;
    }

    // Step 2: decrement stock for every validated item
    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(orderItem.productId, {
        $inc: { stock: -orderItem.quantity },
      });
    }

    // Step 3: calculate commission and totals server-side
    const commissionAmount = Math.round(itemsTotal * COMMISSION_RATE * 100) / 100;
    const grandTotal = itemsTotal + DELIVERY_CHARGE;

    // Step 4: create the order — always starts pending, never pre-marked paid
    const order = await Order.create({
      customerId: req.user!.id,
      items: orderItems,
      itemsTotal,
      deliveryCharge: DELIVERY_CHARGE,
      commissionRate: COMMISSION_RATE,
      commissionAmount,
      grandTotal,
      status: "pending",
      deliveryAddress,
      deliveryPhone,
      paymentMethod,
      paymentStatus: "pending",
    });

    // Step 5: for online payment, create a payment order and attach it — never mark paid here
    if (paymentMethod === "online") {
      const payments = getPaymentService();

      const paymentOrder = await payments.createPaymentOrder({
        amount: grandTotal,
        currency: "INR",
        receipt: order.id,
      });

      order.paymentProvider = payments.provider;
      order.providerOrderId = paymentOrder.providerOrderId;
      await order.save();

      res.status(201).json({
        message: "Order created, payment required",
        order,
        payment: {
          provider: payments.provider,
          providerOrderId: paymentOrder.providerOrderId,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
        },
      });
      return;
    }

    // Cash on Delivery — order is placed, payment happens on delivery
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: (error as Error).message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ customerId: req.user!.id })
      .select("-commissionRate -commissionAmount")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: (error as Error).message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const filter: Record<string, unknown> = { _id: id };
    if (req.user!.role !== "admin") {
      filter.customerId = req.user!.id;
    }

    const order = await Order.findOne(filter).select("-commissionRate -commissionAmount");

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: (error as Error).message });
  }
};

export const getSellerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await Seller.findOne({ userId: req.user!.id, isApproved: true });
    if (!seller) {
      res.status(403).json({ message: "No approved seller profile found for this account" });
      return;
    }

    const orders = await Order.find({ "items.sellerId": seller._id }).sort({ createdAt: -1 });

    const sellerView = orders.map((order) => {
      const myItems = order.items.filter(
        (item) => item.sellerId.toString() === (seller._id as Types.ObjectId).toString()
      );
      const mySubtotal = myItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        orderId: order._id,
        createdAt: order.get("createdAt"),
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        deliveryPhone: order.deliveryPhone,
        myItems,
        mySubtotal,
      };
    });

    res.status(200).json({ count: sellerView.length, orders: sellerView });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller orders", error: (error as Error).message });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const order = await Order.findOne({ _id: id, customerId: req.user!.id });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (order.status !== "pending") {
      res.status(409).json({
        message: `Cannot cancel an order with status "${order.status}"`,
      });
      return;
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: "Cancellation failed", error: (error as Error).message });
  }
};