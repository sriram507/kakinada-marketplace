import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:5000/api/products/public/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await res.json();
  return data.product;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="h-64 bg-gray-100 rounded mb-6 flex items-center justify-center text-gray-400">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover rounded"
          />
        ) : (
          "No image"
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-sm text-gray-500 mt-1">Sold by {product.sellerId.shopName}</p>

      <p className="mt-4 text-xl font-bold text-gray-900">₹{product.price}</p>

      <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

      <p className="mt-2 text-sm text-gray-500">
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>

      <AddToCartButton product={product} />
    </main>
  );
}