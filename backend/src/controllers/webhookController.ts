import { Request, Response } from "express";
import crypto from "crypto";
import { Order } from "../models/Order";

interface RazorpayWebhookEvent {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id: string;
        order_id: string;
        amount: number; // paise
      };
    };
  };
}

const signaturesMatch = (expected: string, received: string): boolean => {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export const handleRazorpayWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set");
      res.status(500).send("Webhook not configured");
      return;
    }

    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.body;

    if (typeof signature !== "string" || !signature) {
      res.status(400).send("Missing signature header");
      return;
    }

    if (!Buffer.isBuffer(rawBody)) {
      res.status(400).send("Expected raw body");
      return;
    }

    const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

    if (!signaturesMatch(expected, signature)) {
      console.warn("Webhook signature mismatch, rejecting");
      res.status(400).send("Invalid signature");
      return;
    }

    // From here on the request is trusted as coming from Razorpay.
    const event: RazorpayWebhookEvent = JSON.parse(rawBody.toString("utf8"));

    // Acknowledge events we don't act on, so Razorpay doesn't keep retrying them.
    if (event.event !== "payment.captured") {
      res.status(200).send("Event ignored");
      return;
    }

    const entity = event.payload?.payment?.entity;
    if (!entity) {
      res.status(200).send("No payment entity");
      return;
    }

    const order = await Order.findOne({ providerOrderId: entity.order_id });

    if (!order) {
      console.warn(`Webhook: no order for Razorpay order ${entity.order_id}`);
      res.status(200).send("No matching order");
      return;
    }

    if (order.paymentStatus === "paid") {
      res.status(200).send("Already processed");
      return;
    }

    if (order.status === "cancelled") {
      console.warn(
        `Webhook: payment ${entity.id} received for CANCELLED order ${order.id}. Needs a manual refund.`
      );
      res.status(200).send("Order cancelled, flagged for refund");
      return;
    }

    if (entity.amount !== Math.round(order.grandTotal * 100)) {
      console.warn(
        `Webhook: amount mismatch for order ${order.id}. Paid ${entity.amount} paise, expected ${Math.round(order.grandTotal * 100)}.`
      );
      res.status(200).send("Amount mismatch, flagged");
      return;
    }

    order.status = "paid";
    order.paymentStatus = "paid";
    order.providerPaymentId = entity.id;
    await order.save();

    console.log(`Webhook: order ${order.id} marked paid (payment ${entity.id})`);
    res.status(200).send("Processed");
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Webhook processing failed");
  }
};
