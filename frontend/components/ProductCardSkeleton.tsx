export default function ProductCardSkeleton() {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-3.5 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}