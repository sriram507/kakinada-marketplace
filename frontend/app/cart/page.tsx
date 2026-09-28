"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty.</p>
        <Link
          href="/products"
          className="inline-block mt-4 bg-gray-900 text-white rounded px-5 py-2 hover:bg-gray-700"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 border rounded-lg p-4"
          >
            <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                "No image"
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.price} each</p>
            </div>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, Number(e.target.value))
              }
              className="border rounded px-2 py-1 w-16 text-center"
            />

            <p className="font-semibold text-gray-900 w-20 text-right">
              ₹{item.price * item.quantity}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-600 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex items-center justify-between">
        <p className="text-lg font-bold text-gray-900">Subtotal: ₹{subtotal}</p>
        <button
          onClick={() => router.push("/checkout")}
          className="bg-gray-900 text-white rounded px-6 py-3 hover:bg-gray-700"
        >
          Proceed to Checkout
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Delivery charge and final total calculated at checkout.
      </p>
    </main>
  );
}