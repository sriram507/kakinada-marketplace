"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ grandTotal: number } | null>(null);

  // Option B enforcement: redirect to login if not authenticated,
  // and come back to /checkout afterward.
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, user, router]);

  // Empty cart (and no order just placed) -> back to the cart page.
  useEffect(() => {
    if (!authLoading && user && items.length === 0 && !placedOrder) {
      router.push("/cart");
    }
  }, [authLoading, user, items, placedOrder, router]);

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      setPlacedOrder(data.order);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return null;
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
          <p className="mt-2 text-gray-600">
            Total charged: ₹{placedOrder.grandTotal}
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 bg-gray-900 text-white rounded px-5 py-2 hover:bg-gray-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded px-3 py-2">
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
            className="border rounded px-3 py-2 w-full"
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
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Payment Method
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online Payment
            </label>
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
          className="bg-gray-900 text-white rounded px-6 py-3 w-full hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </main>
  );
}