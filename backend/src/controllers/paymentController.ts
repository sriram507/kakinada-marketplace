import { Response } from "express";
import { Order } from "../models/Order";
import { AuthRequest } from "../middleware/authMiddleware";
import { getPaymentService } from "../services/payment";

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, providerPaymentId, signature } = req.body as {
      orderId: string;
      providerPaymentId: string;
      signature: string;
    };

    if (!orderId || !providerPaymentId || !signature) {
      res.status(400).json({
        message: "orderId, providerPaymentId, and signature are required",
      });
      return;
    }

    const order = await Order.findOne({ _id: orderId, customerId: req.user!.id });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (order.paymentMethod !== "online") {
      res.status(400).json({ message: "This order does not require online payment verification" });
      return;
    }

    if (order.paymentStatus === "paid") {
      res.status(200).json({ message: "Payment already verified", order });
      return;
    }

    if (!order.providerOrderId) {
      res.status(400).json({ message: "No payment order exists for this order" });
      return;
    }

    const payments = getPaymentService();
    const isValid = payments.verifyPayment({
      providerOrderId: order.providerOrderId,
      providerPaymentId,
      signature,
    });

    if (!isValid) {
      order.paymentStatus = "failed";
      await order.save();
      res.status(400).json({ message: "Payment verification failed", order });
      return;
    }

    order.status = "paid";
    order.paymentStatus = "paid";
    order.providerPaymentId = providerPaymentId;
    await order.save();

    res.status(200).json({ message: "Payment verified successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: (error as Error).message });
  }
};