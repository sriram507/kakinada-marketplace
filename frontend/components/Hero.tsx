"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, Search } from "lucide-react";

const SAMPLE_SEARCHES = ["kurti", "jewellery set", "notebook", "tote bag", "gift box"];
const POPULAR_SEARCHES = ["Kurti", "Necklace", "Notebook", "Backpack", "Gift Hamper"];

export default function Hero() {
  const [search, setSearch] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % SAMPLE_SEARCHES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <section className="bg-emerald-800">
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          Your local Kakinada shops,
          <br className="hidden sm:block" /> now online.
        </h1>
        <p className="mt-4 text-emerald-50 max-w-xl mx-auto">
          Jewellery, fashion, gifts and more from real shops around you,
          delivered to your door.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 max-w-md mx-auto flex items-center bg-white rounded-full shadow-lg overflow-hidden"
        >
          <Search className="ml-4 text-gray-400 flex-shrink-0" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search for "${SAMPLE_SEARCHES[placeholderIndex]}"...`}
            className="w-full px-3 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-emerald-700 text-white font-medium px-5 py-3 hover:bg-emerald-600 transition flex-shrink-0"
          >
            Search
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-emerald-200">Popular:</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/products?search=${encodeURIComponent(term)}`}
              className="bg-emerald-700/60 text-white rounded-full px-3 py-1 hover:bg-emerald-700 transition"
            >
              {term}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-emerald-800 rounded-full px-6 py-3 font-semibold hover:bg-emerald-50 transition shadow-sm"
          >
            <ShoppingBag size={18} />
            Shop Now
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 border-2 border-white text-white rounded-full px-6 py-3 font-semibold hover:bg-white hover:text-emerald-800 transition"
          >
            <Store size={18} />
            Become a Seller
          </Link>
        </div>
      </div>
    </section>
  );
}