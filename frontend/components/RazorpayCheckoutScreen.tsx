"use client";

import { useState } from "react";
import Script from "next/script";
import { CreditCard, ShieldCheck } from "lucide-react";
import { PaymentOrderInfo } from "@/types/order";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
}

interface Props {
  payment: PaymentOrderInfo;
  onPaySuccess: (result: {
    providerPaymentId: string;
    signature: string;
  }) => Promise<void>;
  onCancel: () => Promise<void>;
}

export default function RazorpayCheckoutScreen({ payment, onPaySuccess, onCancel }: Props) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [opening, setOpening] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const openCheckout = () => {
    if (!window.Razorpay) return;

    setOpening(true);

    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      amount: Math.round(payment.amount * 100), // paise, matching the backend's conversion
      currency: payment.currency,
      order_id: payment.providerOrderId,
      name: "Kakinada Marketplace",
      description: "Order payment",
      handler: (response) => {
        setOpening(false);
        onPaySuccess({
          providerPaymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          // Customer closed the popup without paying
          setOpening(false);
        },
      },
      theme: {
        color: "#059669", // emerald-600, matching the app's accent color
      },
    });

    razorpay.open();
  };

  const handleCancel = async () => {
    setCancelling(true);
    await onCancel();
    setCancelling(false);
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="w-full max-w-sm border border-gray-100 rounded-2xl shadow-sm p-6 text-center bg-white">
        <div className="mx-auto bg-emerald-100 rounded-full w-14 h-14 flex items-center justify-center">
          <CreditCard className="text-emerald-700" size={26} />
        </div>

        <h1 className="mt-4 text-lg font-bold text-gray-900">Complete Payment</h1>
        <p className="mt-4 text-3xl font-bold text-gray-900">₹{payment.amount}</p>

        <p className="mt-4 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-1.5 justify-center">
          <ShieldCheck size={14} className="flex-shrink-0" />
          Test mode — use card 4111 1111 1111 1111, any future expiry and CVV.
        </p>

        <button
          onClick={openCheckout}
          disabled={!scriptLoaded || opening || cancelling}
          className="mt-5 w-full bg-emerald-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {!scriptLoaded ? "Loading..." : opening ? "Opening..." : `Pay ₹${payment.amount}`}
        </button>

        <button
          onClick={handleCancel}
          disabled={opening || cancelling}
          className="mt-2 w-full text-gray-500 text-sm hover:text-gray-700 transition disabled:opacity-50"
        >
          {cancelling ? "Cancelling..." : "Cancel Payment"}
        </button>
      </div>
    </main>
  );
}