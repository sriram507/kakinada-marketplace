"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/order";
import StatusBadge from "@/components/StatusBadge";

export default function OrdersPage() {
  const { user, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/mine", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (res.status === 401) {
          logout();
          router.push("/login?redirect=/orders");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, logout, router]);

  if (authLoading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {loading && <p className="text-gray-500">Loading your orders...</p>}

      {error && (
        <p className="bg-red-50 text-red-600 text-sm rounded px-3 py-2">{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div>
          <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/products"
            className="inline-block mt-4 bg-gray-900 text-white rounded px-5 py-2 hover:bg-gray-700"
          >
            Browse Products
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <StatusBadge status={order.status} />
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {" · "}
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>

              <p className="mt-2 font-bold text-gray-900">₹{order.grandTotal}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}