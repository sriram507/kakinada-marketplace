import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Logo from "@/components/Logo";

const categories = [
  "Imitation Jewellery",
  "Women's Fashion",
  "Bags & Wallets",
  "Gifts & Accessories",
  "Stationery",
];

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-50">
      <div className="max-w-5xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <Logo light />

          <p className="text-emerald-200 mt-3">
            Connecting local Kakinada shops with customers nearby. Shop local,
            delivered to your door.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="bg-emerald-800 hover:bg-emerald-700 rounded-full p-2 transition"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="bg-emerald-800 hover:bg-emerald-700 rounded-full p-2 transition"
            >
              <FaInstagram size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Quick Links</p>

          <ul className="space-y-2 text-emerald-100">
            <li>
              <Link
                href="/products"
                className="hover:text-white transition"
              >
                All Products
              </Link>
            </li>

            <li>
              <Link
                href="/cart"
                className="hover:text-white transition"
              >
                My Cart
              </Link>
            </li>

            <li>
              <Link
                href="/orders"
                className="hover:text-white transition"
              >
                My Orders
              </Link>
            </li>

            <li>
              <Link
                href="/register"
                className="hover:text-white transition"
              >
                Become a Seller
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Categories</p>

          <ul className="space-y-2 text-emerald-100">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/products?category=${encodeURIComponent(c)}`}
                  className="hover:text-white transition"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Contact</p>

          <ul className="space-y-2 text-emerald-100">
            <li className="flex items-start gap-2">
              <MapPin
                size={16}
                className="mt-0.5 flex-shrink-0"
              />
              <span>Kakinada, Andhra Pradesh, India</span>
            </li>

            <li className="flex items-center gap-2">
              <Phone
                size={16}
                className="flex-shrink-0"
              />
              <span>+91 00000 00000</span>
            </li>

            <li className="flex items-center gap-2">
              <Mail
                size={16}
                className="flex-shrink-0"
              />
              <span>support@kakinadamarketplace.example</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-200">
          <p>
            © {new Date().getFullYear()} Kakinada Marketplace. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-default">
              Terms
            </span>

            <span className="hover:text-white cursor-default">
              Privacy
            </span>

            <span className="hover:text-white cursor-default">
              Shipping &amp; Delivery
            </span>

            <span className="hover:text-white cursor-default">
              Cancellation &amp; Refunds
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}