import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import mongoose from "mongoose";
import { Order } from "../models/Order";

const sign = (body: string, secret: string): string =>
  crypto.createHmac("sha256", secret).update(body).digest("hex");

const run = async (): Promise<void> => {
  const providerOrderId = process.argv[2];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const mongoUri = process.env.MONGO_URI;

  if (!providerOrderId) {
    console.error("Usage: npm run test:webhook -- <providerOrderId>");
    process.exit(1);
  }
  if (!secret || !mongoUri) {
    console.error("RAZORPAY_WEBHOOK_SECRET and MONGO_URI must be set in .env");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  try {
    const order = await Order.findOne({ providerOrderId });
    if (!order) {
      console.error(`No order found with providerOrderId ${providerOrderId}`);
      return;
    }

    const body = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_webhooktest123",
            order_id: providerOrderId,
            amount: Math.round(order.grandTotal * 100),
          },
        },
      },
    });

    const url = `http://localhost:${process.env.PORT || 5000}/api/payments/webhook`;

    const send = async (label: string, signature: string): Promise<void> => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-razorpay-signature": signature,
        },
        body,
      });
      console.log(`${label}: ${res.status} ${await res.text()}`);
    };

    await send("Wrong signature  ", "not_a_real_signature");
    await send("Valid signature  ", sign(body, secret));
    await send("Replay (same req)", sign(body, secret));

    const updated = await Order.findOne({ providerOrderId });
    console.log("Order now:", {
      status: updated?.status,
      paymentStatus: updated?.paymentStatus,
      providerPaymentId: updated?.providerPaymentId,
    });
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});