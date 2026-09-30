"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/order";
import StatusBadge from "@/components/StatusBadge";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/orders/${id}`);
    }
  }, [authLoading, user, router, id]);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (res.status === 401) {
          logout();
          router.push(`/login?redirect=/orders/${id}`);
          return;
        }

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load order");
        }

        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, id, logout, router]);

  if (authLoading || !user) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        <p className="text-gray-500">Loading order...</p>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded px-3 py-2 mb-4">{error}</p>
        )}
        <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
        <Link href="/orders" className="inline-block mt-4 text-gray-900 underline">
          Back to My Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900">
        ← My Orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Order #{order._id.slice(-6).toUpperCase()}
        </h1>
        <StatusBadge status={order.status} />
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Placed on{" "}
        {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <section className="mt-6 border rounded-lg divide-y">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} × ₹{item.price}
              </p>
            </div>
            <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 border rounded-lg p-4 space-y-1 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Items total</span>
          <span>₹{order.itemsTotal}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery charge</span>
          <span>₹{order.deliveryCharge}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
          <span>Total</span>
          <span>₹{order.grandTotal}</span>
        </div>
      </section>

      <section className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-1">Delivery</h2>
          <p className="text-gray-700 whitespace-pre-line">{order.deliveryAddress}</p>
          <p className="text-gray-700 mt-1">Phone: {order.deliveryPhone}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-1">Payment</h2>
          <p className="text-gray-700">
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online payment"}
          </p>
          {order.paymentStatus && (
            <p className="text-gray-700 mt-1 capitalize">
              Payment status: {order.paymentStatus}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}