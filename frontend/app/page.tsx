import Link from "next/link";
import { Search, CreditCard, Truck, ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { PublicSeller } from "@/types/seller";
import TaglineBar from "@/components/TaglineBar";
import BannerCarousel from "@/components/BannerCarousel";
import CategoryTiles from "@/components/CategoryTiles";
import ProductCard from "@/components/ProductCard";
import WhyShopWithUs from "@/components/WhyShopWithUs";
import SectionHeading from "@/components/SectionHeading";
import { getCategoryStyle } from "@/lib/categoryStyles";

async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/api/products/public?limit=8", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch featured products");
  const data = await res.json();
  return data.products;
}

async function getStores(): Promise<PublicSeller[]> {
  const res = await fetch("http://localhost:5000/api/seller/public", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch stores");
  const data = await res.json();
  return data.sellers;
}

export default async function Home() {
  const [products, stores] = await Promise.all([getFeaturedProducts(), getStores()]);

  const steps = [
    { icon: Search, title: "Browse", desc: "Find products from shops across Kakinada." },
    { icon: CreditCard, title: "Order", desc: "Pay online or choose Cash on Delivery." },
    { icon: Truck, title: "Delivered", desc: "Local delivery, right to your door." },
  ];

  return (
    <main className="bg-[#faf8f4]">
      <TaglineBar />
      <BannerCarousel />

      <div className="pt-10">
        <CategoryTiles />
      </div>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <SectionHeading
          eyebrow="Just in"
          title="Recently Added"
          action={
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm text-emerald-700 font-semibold hover:gap-2 transition-all"
            >
              View all <ArrowRight size={14} />
            </Link>
          }
        />

        {products.length === 0 ? (
          <p className="text-gray-500">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {stores.length > 0 && (
        <section className="bg-gray-50 border-y">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <SectionHeading eyebrow="Local shops" title="Shop by Store" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stores.map((store) => {
                const { icon: Icon, bg, text } = getCategoryStyle(store.category);
                return (
                  <Link
                    key={store._id}
                    href={`/products?category=${encodeURIComponent(store.category)}`}
                    className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                      <Icon className={text} size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{store.shopName}</p>
                      <p className={`text-xs font-medium mt-0.5 ${text}`}>{store.category}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {store.productCount} {store.productCount === 1 ? "product" : "products"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <WhyShopWithUs />

      <section className="max-w-5xl mx-auto px-6 py-14">
        <SectionHeading eyebrow="Getting started" title="How It Works" />
        <div className="relative grid sm:grid-cols-3 gap-8 mt-8">
          <div className="hidden sm:block absolute top-7 left-[16.5%] right-[16.5%] h-0.5 bg-emerald-100" />
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative text-center">
              <div className="relative z-10 mx-auto bg-emerald-600 rounded-full w-14 h-14 flex items-center justify-center shadow-md shadow-emerald-600/25">
                <Icon className="text-white" size={24} />
              </div>
              <p className="mt-4 font-semibold text-gray-900 text-base">
                {i + 1}. {title}
              </p>
              <p className="text-sm text-gray-600 mt-1 max-w-[200px] mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden text-center bg-gray-900 rounded-3xl py-12 px-6">
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-emerald-600/20 rounded-full" />
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full" />

          <div className="relative">
            <h2 className="text-2xl font-bold text-white">
              Own a shop in Kakinada?
            </h2>
            <p className="text-gray-300 mt-2 max-w-md mx-auto">
              Reach more customers by listing your products on Kakinada Marketplace.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-6 bg-emerald-600 text-white rounded-full px-7 py-3 font-semibold hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/25"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}