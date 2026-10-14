import Razorpay from "razorpay";
import crypto from "crypto";
import {
  PaymentService,
  CreatePaymentParams,
  PaymentOrder,
  VerifyPaymentParams,
} from "./PaymentService";

export class RazorpayPaymentService implements PaymentService {
  readonly provider = "razorpay" as const;
  private client: Razorpay;
  private keySecret: string;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env to use the razorpay provider"
      );
    }

    this.keySecret = keySecret;
    this.client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  async createPaymentOrder(params: CreatePaymentParams): Promise<PaymentOrder> {
    if (params.amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    // Razorpay expects the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(params.amount * 100);

    const razorpayOrder = await this.client.orders.create({
      amount: amountInPaise,
      currency: params.currency,
      receipt: params.receipt,
    });

    return {
      providerOrderId: razorpayOrder.id,
      amount: params.amount,
      currency: params.currency,
    };
  }

  verifyPayment(params: VerifyPaymentParams): boolean {
    const expected = crypto
      .createHmac("sha256", this.keySecret)
      .update(`${params.providerOrderId}|${params.providerPaymentId}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expected, "utf8");
    const receivedBuffer = Buffer.from(params.signature, "utf8");

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  }
}