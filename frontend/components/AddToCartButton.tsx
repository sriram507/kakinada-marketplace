"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (product.stock === 0) {
    return (
      <p className="mt-4 text-red-600 font-medium">Out of stock</p>
    );
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <input
        type="number"
        min={1}
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="border rounded px-3 py-2 w-20"
      />
      <button
        onClick={handleAdd}
        className="bg-gray-900 text-white rounded px-5 py-2 hover:bg-gray-700"
      >
        {added ? "Added!" : "Add to Cart"}
      </button>
      <button
        onClick={() => {
          handleAdd();
          router.push("/cart");
        }}
        className="border border-gray-900 text-gray-900 rounded px-5 py-2 hover:bg-gray-50"
      >
        Buy Now
      </button>
    </div>
  );
}