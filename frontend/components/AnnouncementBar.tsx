"use client";

import { useEffect, useState } from "react";
import { Truck, ShieldCheck, BadgePercent } from "lucide-react";

const messages = [
  { icon: Truck, text: "Local delivery across Kakinada" },
  { icon: ShieldCheck, text: "Cash on Delivery available on every order" },
  { icon: BadgePercent, text: "New sellers joining every week — check back often" },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const { icon: Icon, text } = messages[index];

  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 h-8 flex items-center justify-center gap-2 text-xs font-medium">
        <Icon size={14} className="text-emerald-400 flex-shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}