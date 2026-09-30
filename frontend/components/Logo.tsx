import Link from "next/link";
import { Store } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
      <span className="bg-emerald-700 text-white rounded-lg p-1.5 flex items-center justify-center">
        <Store size={18} />
      </span>
      <span
        className={`font-bold text-base sm:text-lg leading-none ${
          light ? "text-white" : "text-gray-900"
        }`}
      >
        Kakinada
        <span className={light ? "text-amber-300" : "text-emerald-600"}>
          Marketplace
        </span>
      </span>
    </Link>
  );
}