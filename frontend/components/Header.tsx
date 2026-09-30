"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { itemCount } = useCart();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    setMenuOpen(false);
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
      <div className="px-4 sm:px-6 py-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-gray-700 flex-shrink-0"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Logo />

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl mx-auto items-center border-2 border-gray-200 focus-within:border-emerald-600 rounded-full overflow-hidden transition"
        >
          <Search className="ml-3 text-gray-400 flex-shrink-0" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, shops, categories..."
            className="w-full px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-emerald-700 text-white font-medium px-5 py-2 hover:bg-emerald-800 transition flex-shrink-0"
          >
            Search
          </button>
        </form>

        <nav className="hidden md:flex items-center gap-4 text-sm ml-auto md:ml-0">
          <Link href="/products" className="text-gray-700 hover:text-emerald-700 font-medium">
            Products
          </Link>

          <Link href="/cart" className="text-gray-700 hover:text-emerald-700 font-medium">
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/orders" className="text-gray-700 hover:text-emerald-700 font-medium">
                    My Orders
                  </Link>
                  <span className="text-gray-500 hidden lg:inline">Hi, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-white bg-gray-900 rounded-full px-4 py-1.5 hover:bg-gray-700 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-white bg-emerald-700 rounded-full px-4 py-1.5 hover:bg-emerald-800 font-medium"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Cart always visible on mobile, outside the collapsible menu */}
        <Link href="/cart" className="md:hidden ml-auto text-gray-700 flex-shrink-0 text-sm font-medium">
          Cart{itemCount > 0 ? ` (${itemCount})` : ""}
        </Link>
      </div>

      {/* Mobile search row */}
      <form onSubmit={handleSearch} className="md:hidden px-4 pb-3 flex items-center">
        <div className="flex items-center border-2 border-gray-200 focus-within:border-emerald-600 rounded-full overflow-hidden w-full transition">
          <Search className="ml-3 text-gray-400 flex-shrink-0" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="bg-emerald-700 text-white font-medium px-4 py-2 hover:bg-emerald-800 transition flex-shrink-0 text-sm"
          >
            Go
          </button>
        </div>
      </form>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-3 bg-white">
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">
            Products
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/orders" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">
                    My Orders
                  </Link>
                  <p className="text-gray-500 text-sm">Signed in as {user.name}</p>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left text-white bg-gray-900 rounded-full px-4 py-2 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white bg-emerald-700 rounded-full px-4 py-2 font-medium text-center"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}