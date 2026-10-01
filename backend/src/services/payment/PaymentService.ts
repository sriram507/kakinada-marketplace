export type PaymentProvider = "mock" | "razorpay";

export interface CreatePaymentParams {
  amount: number; // in rupees
  currency: string; // e.g. "INR"
  receipt: string; // our own reference, e.g. the order ID
}

export interface PaymentOrder {
  providerOrderId: string;
  amount: number; // in rupees
  currency: string;
}

export interface VerifyPaymentParams {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export interface PaymentService {
  readonly provider: PaymentProvider;
  createPaymentOrder(params: CreatePaymentParams): Promise<PaymentOrder>;
  verifyPayment(params: VerifyPaymentParams): boolean;
}