"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg text-gray-900">
        Kakinada Marketplace
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        <Link href="/products" className="text-gray-700 hover:text-gray-900">
          Products
        </Link>

        <Link href="/cart" className="text-gray-700 hover:text-gray-900">
          Cart{itemCount > 0 ? ` (${itemCount})` : ""}
        </Link>

        {!loading && (
          <>
            {user ? (
              <>
                <span className="text-gray-600">Hi, {user.name}</span>
                <button onClick={logout} className="text-gray-700 hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}