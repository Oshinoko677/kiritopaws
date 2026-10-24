"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";

export default function AddToCart({ product }) {
  const { addToCart } = useApp();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function buyNow() {
    addToCart(product, qty);
    router.push("/cart");
  }

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Quantity</span>
        <div className="flex items-center bg-purple-50 rounded-full">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 text-lg text-purple-900">−</button>
          <span className="w-8 text-center text-black">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-9 h-9 text-lg text-purple-900">+</button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={add} className="bg-purple-100 text-purple-900 px-6 py-2.5 rounded-full font-medium">
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
        <button onClick={buyNow} className="bg-purple-700 text-white px-6 py-2.5 rounded-full font-medium">
          Buy now
        </button>
      </div>
    </div>
  );
}
