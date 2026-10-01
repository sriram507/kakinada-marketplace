"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { PaymentOrderInfo } from "@/types/order";

interface Props {
  payment: PaymentOrderInfo;
  onPaySuccess: () => Promise<void>;
  onCancel: () => Promise<void>;
}

export default function MockPaymentScreen({ payment, onPaySuccess, onCancel }: Props) {
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    // Simulates the delay of a real payment gateway popup
    await new Promise((resolve) => setTimeout(resolve, 900));
    await onPaySuccess();
    setProcessing(false);
  };

  const handleCancel = async () => {
    setCancelling(true);
    await onCancel();
    setCancelling(false);
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm border border-gray-100 rounded-2xl shadow-sm p-6 text-center bg-white">
        <div className="mx-auto bg-emerald-100 rounded-full w-14 h-14 flex items-center justify-center">
          <CreditCard className="text-emerald-700" size={26} />
        </div>

        <h1 className="mt-4 text-lg font-bold text-gray-900">Complete Payment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Provider: <span className="font-medium capitalize">{payment.provider}</span>
        </p>

        <p className="mt-4 text-3xl font-bold text-gray-900">
          ₹{payment.amount}
        </p>
        <p className="text-xs text-gray-400 mt-1">Reference: {payment.providerOrderId}</p>

        <p className="mt-4 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-1.5 justify-center">
          <ShieldCheck size={14} className="flex-shrink-0" />
          Test mode — no real payment will be made.
        </p>

        <button
          onClick={handlePay}
          disabled={processing || cancelling}
          className="mt-5 w-full bg-emerald-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {processing ? "Processing..." : `Pay ₹${payment.amount}`}
        </button>

        <button
          onClick={handleCancel}
          disabled={processing || cancelling}
          className="mt-2 w-full text-gray-500 text-sm hover:text-gray-700 transition disabled:opacity-50"
        >
          {cancelling ? "Cancelling..." : "Cancel Payment"}
        </button>
      </div>
    </main>
  );
}