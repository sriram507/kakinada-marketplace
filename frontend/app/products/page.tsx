import { Product } from "@/types/product";
import Link from "next/link";

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function getProducts(category?: string, search?: string): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);

  const res = await fetch(
    `http://localhost:5000/api/products/public?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

async function getCategories(): Promise<string[]> {
  const res = await fetch("http://localhost:5000/api/products/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();
  return data.categories;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  const [{ products }, categories] = await Promise.all([
    getProducts(category, search),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Products</h1>

      <form className="flex flex-col sm:flex-row gap-3 mb-6" method="get">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          defaultValue={search ?? ""}
          className="border rounded px-3 py-2 flex-1"
        />

        <select
          name="category"
          defaultValue={category ?? ""}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-gray-900 text-white rounded px-4 py-2 hover:bg-gray-700"
        >
          Filter
        </button>
      </form>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition block"
            >
              <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">
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
              <h2 className="font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.sellerId.shopName}</p>
              <p className="mt-1 font-bold text-gray-900">₹{product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}