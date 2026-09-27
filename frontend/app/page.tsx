import Link from "next/link";
import { Product } from "@/types/product";

interface ProductsResponse {
  products: Product[];
}

async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(
    "http://localhost:5000/api/products/public?limit=4",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch featured products");
  }

  const data: ProductsResponse = await res.json();
  return data.products;
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <main className="min-h-screen p-8">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Kakinada Marketplace
        </h1>
        <p className="mt-2 text-gray-600">
          Local shops, delivered to your door.
        </p>
        <Link
          href="/products"
          className="inline-block mt-4 bg-gray-900 text-white rounded px-5 py-2 hover:bg-gray-700"
        >
          Browse All Products
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recently Added
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition block"
              >
                <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">
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
                <h3 className="font-semibold text-gray-900 text-sm">
                  {product.name}
                </h3>
                <p className="mt-1 font-bold text-gray-900 text-sm">
                  ₹{product.price}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}