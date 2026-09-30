"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SectionHeading from "@/components/SectionHeading";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6 text-center">
        <div>
          <ShoppingBag className="mx-auto text-gray-300" size={48} />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-gray-500">Browse products and add something you like.</p>
          <Link
            href="/products"
            className="inline-block mt-6 bg-emerald-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-emerald-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 sm:p-8 max-w-2xl mx-auto">
      <SectionHeading eyebrow="Review" title="Your Cart" />

      <div className="space-y-3 mt-2">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 bg-white shadow-sm"
          >
            <div className="h-16 w-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 text-xs flex-shrink-0 overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                item.name.slice(0, 1)
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.price} each</p>
            </div>

            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="p-1.5 text-gray-600 hover:text-emerald-700"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="p-1.5 text-gray-600 hover:text-emerald-700"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <p className="font-semibold text-gray-900 w-16 text-right">
              ₹{item.price * item.quantity}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              aria-label="Remove item"
              className="text-gray-400 hover:text-red-600 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900">Subtotal: ₹{subtotal}</p>
          <p className="text-sm text-gray-500">
            Delivery charge and final total calculated at checkout.
          </p>
        </div>
        <button
          onClick={() => router.push("/checkout")}
          className="bg-emerald-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/25 flex-shrink-0"
        >
          Checkout
        </button>
      </div>
    </main>
  );
}