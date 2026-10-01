import { PaymentService } from "./PaymentService";
import { MockPaymentService } from "./MockPaymentService";

let instance: PaymentService | null = null;

export const getPaymentService = (): PaymentService => {
  if (instance) return instance;

  const provider = process.env.PAYMENT_PROVIDER || "mock";

  if (provider === "mock") {
    instance = new MockPaymentService();
    return instance;
  }

  if (provider === "razorpay") {
    throw new Error("RazorpayPaymentService is not implemented yet");
  }

  throw new Error(`Unknown PAYMENT_PROVIDER: ${provider}`);
};

export * from "./PaymentService";