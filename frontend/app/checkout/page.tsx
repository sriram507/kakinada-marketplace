"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { PaymentOrderInfo } from "@/types/order";
import MockPaymentScreen from "@/components/MockPaymentScreen";

interface OrderResponse {
  order: { _id: string; grandTotal: number };
  payment?: PaymentOrderInfo;
}

export default function CheckoutPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Three possible screens after submitting: awaiting payment, success, or neither (the form)
  const [pendingPayment, setPendingPayment] = useState<{
    orderId: string;
    payment: PaymentOrderInfo;
  } | null>(null);
  const [placedOrder, setPlacedOrder] = useState<{ grandTotal: number } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user && items.length === 0 && !placedOrder && !pendingPayment) {
      router.push("/cart");
    }
  }, [authLoading, user, items, placedOrder, pendingPayment, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          deliveryAddress,
          deliveryPhone,
          paymentMethod,
        }),
      });

      const data: OrderResponse & { message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      if (paymentMethod === "online" && data.payment) {
        // Don't clear the cart yet — the order isn't paid until verify succeeds
        setPendingPayment({ orderId: data.order._id, payment: data.payment });
      } else {
        setPlacedOrder(data.order);
        clearCart();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaySuccess = async () => {
    if (!pendingPayment) return;

    try {
      const res = await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: pendingPayment.orderId,
          // In real Razorpay (Step 5) these come from the actual payment popup's result.
          // The mock provider accepts this exact fixed pair as a "successful" payment.
          providerPaymentId: `mock_pay_${Date.now()}`,
          signature: "mock_signature_ok",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment verification failed");
      }

      setPlacedOrder(data.order);
      setPendingPayment(null);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment verification failed");
      setPendingPayment(null);
    }
  };

  const handlePayCancel = async () => {
    if (!pendingPayment) return;

    try {
      await fetch(`http://localhost:5000/api/orders/${pendingPayment.orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      setPendingPayment(null);
      router.push("/cart");
    }
  };

  if (authLoading || !user) {
    return null;
  }

  if (pendingPayment) {
    return (
      <MockPaymentScreen
        payment={pendingPayment.payment}
        onPaySuccess={handlePaySuccess}
        onCancel={handlePayCancel}
      />
    );
  }

  if (placedOrder) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
          <p className="mt-2 text-gray-600">
            Total charged: ₹{placedOrder.grandTotal}
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 bg-emerald-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-emerald-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 sm:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Delivery Address
          </label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
            rows={3}
            className="border border-gray-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Delivery Phone
          </label>
          <input
            type="tel"
            value={deliveryPhone}
            onChange={(e) => setDeliveryPhone(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className={`border rounded-xl px-4 py-3 text-sm font-medium transition ${
                paymentMethod === "cod"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              Cash on Delivery
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("online")}
              className={`border rounded-xl px-4 py-3 text-sm font-medium transition ${
                paymentMethod === "online"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              Online Payment
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-gray-700">Subtotal: ₹{subtotal}</p>
          <p className="text-sm text-gray-500">
            Delivery charge and any applicable commission are calculated when you submit.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-600 text-white rounded-full px-6 py-3 w-full font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </main>
  );
}