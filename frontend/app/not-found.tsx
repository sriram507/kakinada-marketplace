import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 text-center">
      <div>
        <SearchX className="mx-auto text-emerald-600" size={48} />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 bg-emerald-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-emerald-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}