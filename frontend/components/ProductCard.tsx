import Link from "next/link";
import { Product } from "@/types/product";
import { getCategoryStyle } from "@/lib/categoryStyles";

export default function ProductCard({ product }: { product: Product }) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;
  const { icon: Icon, bg, text } = getCategoryStyle(product.category);

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white"
    >
      <div className={`relative h-40 flex items-center justify-center ${bg}`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon className={`${text} opacity-40`} size={40} />
        )}

        {outOfStock && (
          <span className="absolute top-2 left-2 bg-gray-900 text-white text-[11px] font-medium rounded-full px-2.5 py-1">
            Out of stock
          </span>
        )}
        {lowStock && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[11px] font-medium rounded-full px-2.5 py-1">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
          {product.sellerId.shopName}
        </p>
        <p className="mt-1.5 font-bold text-gray-900">₹{product.price}</p>
      </div>
    </Link>
  );
}