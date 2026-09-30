"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Tag, Percent, Gift, Star } from "lucide-react";

interface Banner {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  gradient: string; // used until a real image is added
  icon: typeof Sparkles; // used until a real image is added
  imageUrl?: string; // paste a Cloudflare R2 (or any) image URL here once ready — no other config needed
}

/**
 * BANNER LIST — this is the only place you need to edit to add, remove, or
 * update a banner for a festival or offer.
 *
 * To add a real photo once it's uploaded to Cloudflare R2:
 *   imageUrl: "https://your-r2-domain.example.com/banners/diwali-2026.jpg"
 * The photo will show behind the text automatically, with the gradient
 * still tinting it slightly so the white text stays readable. Any https
 * image URL works here — R2, a CDN, or elsewhere — no extra setup needed.
 *
 * To remove a banner: delete its object from this array.
 * To add one: copy an existing object and edit every field.
 */
const banners: Banner[] = [
  {
    title: "New This Week",
    subtitle: "Fresh arrivals from local Kakinada sellers",
    ctaText: "Explore New Arrivals",
    ctaLink: "/products",
    gradient: "from-emerald-600 to-emerald-800",
    icon: Sparkles,
  },
  {
    title: "Festive Jewellery Collection",
    subtitle: "Up to 20% off imitation jewellery this week",
    ctaText: "Shop Jewellery",
    ctaLink: "/products?category=Imitation%20Jewellery",
    gradient: "from-amber-500 to-amber-700",
    icon: Percent,
  },
  {
    title: "Back to School",
    subtitle: "Notebooks, pens and desk essentials from Vidya Stationers",
    ctaText: "Shop Stationery",
    ctaLink: "/products?category=Stationery",
    gradient: "from-sky-600 to-sky-800",
    icon: Tag,
  },
  {
    title: "Gifting Made Easy",
    subtitle: "Hampers, candles and personalised gifts for every occasion",
    ctaText: "Shop Gifts",
    ctaLink: "/products?category=Gifts%20%26%20Accessories",
    gradient: "from-rose-500 to-rose-700",
    icon: Gift,
  },
  {
    title: "Trending in Fashion",
    subtitle: "Kurtis, sarees and everyday wear loved by Kakinada shoppers",
    ctaText: "Shop Fashion",
    ctaLink: "/products?category=Women%27s%20Fashion",
    gradient: "from-violet-600 to-violet-800",
    icon: Star,
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => setIndex((i + banners.length) % banners.length);

  const banner = banners[index];
  const Icon = banner.icon;

  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden">
        <Link
          href={banner.ctaLink}
          className={`relative flex items-center justify-center sm:justify-start h-[66vh] min-h-[280px] max-h-[560px] px-6 sm:px-16 bg-gradient-to-r ${banner.gradient} transition-colors`}
        >
          {banner.imageUrl ? (
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          ) : null}

          <div className="relative z-10 text-white max-w-md text-center sm:text-left">
            <p className="text-xs uppercase tracking-wide font-semibold text-white/80">
              Limited time
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">{banner.title}</h3>
            <p className="text-sm sm:text-base text-white/90 mt-2">{banner.subtitle}</p>
            <span className="inline-block mt-5 bg-white text-gray-900 rounded-full px-5 py-2.5 text-sm font-semibold">
              {banner.ctaText}
            </span>
          </div>

          <Icon className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hidden md:block" size={160} />
        </Link>

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to banner ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}