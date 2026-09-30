import { ShieldCheck, Truck, BadgeIndianRupee, Headset } from "lucide-react";
import SectionHeading from "./SectionHeading";

const points = [
  {
    icon: ShieldCheck,
    title: "Verified Local Sellers",
    desc: "Every shop is reviewed and approved before it can list products.",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  {
    icon: Truck,
    title: "Local Delivery",
    desc: "Delivered across Kakinada, straight to your door.",
    bg: "bg-sky-100",
    text: "text-sky-700",
  },
  {
    icon: BadgeIndianRupee,
    title: "Secure Payments",
    desc: "Pay online safely, or choose Cash on Delivery.",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  {
    icon: Headset,
    title: "Local Support",
    desc: "Real help from a team based right here in Kakinada.",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
];

export default function WhyShopWithUs() {
  return (
    <section className="bg-gray-50 border-y">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <SectionHeading eyebrow="Why shop with us" title="Built for Kakinada" />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {points.map(({ icon: Icon, title, desc, bg, text }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={text} size={22} />
              </div>
              <p className="mt-3 font-semibold text-gray-900">{title}</p>
              <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}