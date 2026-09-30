import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import SectionHeading from "@/components/SectionHeading";

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const SORT_LABELS: Record<string, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  name_asc: "Name: A to Z",
};

async function getProducts(
  category?: string,
  search?: string,
  page?: string,
  sort?: string
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (page) params.set("page", page);
  if (sort) params.set("sort", sort);

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
  searchParams: Promise<{ category?: string; search?: string; page?: string; sort?: string }>;
}) {
  const { category, search, page, sort } = await searchParams;

  const [{ products, pagination }, categories] = await Promise.all([
    getProducts(category, search, page, sort),
    getCategories(),
  ]);

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <main className="min-h-screen p-6 sm:p-8 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow={category || "All items"}
        title={search ? `Results for "${search}"` : "All Products"}
      />

      <form className="mb-6 space-y-3" method="get">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          defaultValue={search ?? ""}
          className="border border-gray-200 rounded-full px-4 py-2.5 w-full focus:outline-none focus:border-emerald-500"
        />

        <div className="flex flex-wrap gap-3">
          <select
            name="category"
            defaultValue={category ?? ""}
            className="border border-gray-200 rounded-full px-4 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="sort"
            defaultValue={sort ?? "newest"}
            className="border border-gray-200 rounded-full px-4 py-2 text-sm"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-emerald-700 transition"
          >
            Apply
          </button>
        </div>
      </form>

      <p className="text-sm text-gray-500 mb-4">
        {pagination.total} {pagination.total === 1 ? "product" : "products"} found
      </p>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No products found.</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination page={pagination.page} totalPages={pagination.totalPages} buildHref={buildHref} />
        </>
      )}
    </main>
  );
}