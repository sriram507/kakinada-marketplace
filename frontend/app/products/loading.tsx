import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <main className="min-h-screen p-8">
      <div className="h-8 w-40 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="h-12 bg-gray-100 rounded-full animate-pulse mb-6 max-w-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}