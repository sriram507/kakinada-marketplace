import {
  PaymentService,
  CreatePaymentParams,
  PaymentOrder,
  VerifyPaymentParams,
} from "./PaymentService";

export const MOCK_VALID_SIGNATURE = "mock_signature_ok";

export class MockPaymentService implements PaymentService {
  readonly provider = "mock" as const;

  constructor() {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MockPaymentService must never be used in production");
    }
  }

  async createPaymentOrder(params: CreatePaymentParams): Promise<PaymentOrder> {
    if (params.amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    const random = Math.random().toString(36).slice(2, 10);

    return {
      providerOrderId: `mock_order_${Date.now()}_${random}`,
      amount: params.amount,
      currency: params.currency,
    };
  }

  verifyPayment(params: VerifyPaymentParams): boolean {
    return (
      params.providerOrderId.startsWith("mock_order_") &&
      params.providerPaymentId.startsWith("mock_pay_") &&
      params.signature === MOCK_VALID_SIGNATURE
    );
  }
}