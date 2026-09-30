import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function TaglineBar() {
  return (
    <section className="relative overflow-hidden bg-gray-50 border-b">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-100/60 rounded-full" />
      <div className="absolute right-24 bottom-0 w-24 h-24 bg-amber-100/60 rounded-full" />

      <div className="relative max-w-5xl mx-auto px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles size={12} />
            Kakinada&apos;s own marketplace
          </span>
          <h1 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            Your local shops, now online.
          </h1>
          <p className="mt-1 text-gray-600 text-sm max-w-md">
            Jewellery, fashion, gifts and more — delivered to your door.
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/25"
          >
            <ShoppingBag size={16} />
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}