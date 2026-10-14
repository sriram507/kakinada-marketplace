import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import { getPaymentService } from "../services/payment";
import { MOCK_VALID_SIGNATURE } from "../services/payment/MockPaymentService";

const run = async (): Promise<void> => {
  const payments = getPaymentService();
  console.log("Provider:", payments.provider);

  const order = await payments.createPaymentOrder({
    amount: 500,
    currency: "INR",
    receipt: "test-receipt-1",
  });
  console.log("Created:", order);

  const isMock = payments.provider === "mock";
  const paymentId = isMock ? "mock_pay_123" : "pay_test_123";

  const validSignature = isMock
    ? MOCK_VALID_SIGNATURE
    : crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(`${order.providerOrderId}|${paymentId}`)
        .digest("hex");

  console.log(
    "Verify with valid signature:",
    payments.verifyPayment({
      providerOrderId: order.providerOrderId,
      providerPaymentId: paymentId,
      signature: validSignature,
    })
  );

  console.log(
    "Verify with wrong signature:",
    payments.verifyPayment({
      providerOrderId: order.providerOrderId,
      providerPaymentId: paymentId,
      signature: "tampered",
    })
  );

  try {
    await payments.createPaymentOrder({ amount: 0, currency: "INR", receipt: "x" });
  } catch (error) {
    console.log("Zero amount rejected:", (error as Error).message);
  }
};

run().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});