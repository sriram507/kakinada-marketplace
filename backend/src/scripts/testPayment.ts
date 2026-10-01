import dotenv from "dotenv";
dotenv.config();

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

  const good = payments.verifyPayment({
    providerOrderId: order.providerOrderId,
    providerPaymentId: "mock_pay_123",
    signature: MOCK_VALID_SIGNATURE,
  });
  console.log("Verify with valid signature:", good);

  const bad = payments.verifyPayment({
    providerOrderId: order.providerOrderId,
    providerPaymentId: "mock_pay_123",
    signature: "tampered",
  });
  console.log("Verify with wrong signature:", bad);

  try {
    await payments.createPaymentOrder({ amount: 0, currency: "INR", receipt: "x" });
  } catch (error) {
    console.log("Zero amount rejected:", (error as Error).message);
  }
};

run();