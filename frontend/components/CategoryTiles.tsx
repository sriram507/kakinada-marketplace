import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { categoryNames, getCategoryStyle } from "@/lib/categoryStyles";

export default function CategoryTiles() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <SectionHeading eyebrow="Browse" title="Shop by Category" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categoryNames.map((name) => {
          const { icon: Icon, bg, text, ring } = getCategoryStyle(name);
          return (
            <Link
              key={name}
              href={`/products?category=${encodeURIComponent(name)}`}
              className={`flex flex-col items-center justify-center gap-3 border-2 border-gray-100 bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition ${ring}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}>
                <Icon className={text} size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-900">{name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}