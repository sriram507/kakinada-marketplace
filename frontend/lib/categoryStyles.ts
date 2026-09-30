import { Gem, Shirt, ShoppingBag, Gift, PenTool, Store, LucideIcon } from "lucide-react";

interface CategoryStyle {
  icon: LucideIcon;
  bg: string;
  text: string;
  ring: string;
}

const styles: Record<string, CategoryStyle> = {
  "Imitation Jewellery": { icon: Gem, bg: "bg-rose-100", text: "text-rose-700", ring: "hover:border-rose-300" },
  "Women's Fashion": { icon: Shirt, bg: "bg-violet-100", text: "text-violet-700", ring: "hover:border-violet-300" },
  "Bags & Wallets": { icon: ShoppingBag, bg: "bg-amber-100", text: "text-amber-700", ring: "hover:border-amber-300" },
  "Gifts & Accessories": { icon: Gift, bg: "bg-sky-100", text: "text-sky-700", ring: "hover:border-sky-300" },
  Stationery: { icon: PenTool, bg: "bg-emerald-100", text: "text-emerald-700", ring: "hover:border-emerald-300" },
};

const fallback: CategoryStyle = {
  icon: Store,
  bg: "bg-gray-100",
  text: "text-gray-700",
  ring: "hover:border-gray-300",
};

export const getCategoryStyle = (category: string): CategoryStyle => styles[category] ?? fallback;

export const categoryNames = Object.keys(styles);


