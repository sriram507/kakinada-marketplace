import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({ page, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`p-2 rounded-full border ${
          page === 1
            ? "text-gray-300 border-gray-100 pointer-events-none"
            : "text-gray-700 border-gray-200 hover:bg-gray-50"
        }`}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && (
            <span className="text-gray-400 px-1">…</span>
          )}
          <Link
            href={buildHref(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${
              p === page
                ? "bg-emerald-600 text-white"
                : "text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`p-2 rounded-full border ${
          page === totalPages
            ? "text-gray-300 border-gray-100 pointer-events-none"
            : "text-gray-700 border-gray-200 hover:bg-gray-50"
        }`}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}