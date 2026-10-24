"use client";
import Link from "next/link";
import SafeImage from "../components/SafeImage";
import { useApp } from "../providers";

export default function Cart() {
  const { cart, cartTotal, setQty, removeFromCart } = useApp();

  if (cart.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 mt-8 text-center text-black">
        <p className="text-5xl">🛒</p>
        <h1 className="text-xl font-bold mt-2">Your cart is empty</h1>
        <Link href="/products" className="inline-block mt-4 bg-purple-700 text-white px-6 py-2 rounded-full">
          Start shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 mt-4">
      <h1 className="text-2xl font-bold text-black">Your cart</h1>
      <div className="mt-3 bg-white rounded-2xl divide-y divide-purple-100">
        {cart.map((i) => (
          <div key={i.id} className="p-3 flex gap-3 items-center">
           <SafeImage src={i.image_url} alt={i.name} className="w-20 h-20 rounded-xl shrink-0" fit="contain" />
            <div className="flex-1 min-w-0">
              <Link href={"/products/" + i.id} className="text-black font-medium line-clamp-2">{i.name}</Link>
              <p className="text-purple-700 font-bold">Rs. {i.price}</p>
              <div className="mt-1 flex items-center gap-3">
                <div className="flex items-center bg-purple-50 rounded-full">
                  <button onClick={() => setQty(i.id, i.qty - 1)} className="w-8 h-8 text-purple-900">−</button>
                  <span className="w-7 text-center text-black text-sm">{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} className="w-8 h-8 text-purple-900">+</button>
                </div>
                <button onClick={() => removeFromCart(i.id)} className="text-sm text-gray-500 underline">Remove</button>
              </div>
            </div>
            <p className="font-semibold text-black hidden sm:block">Rs. {i.price * i.qty}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-black text-lg">Total: <b className="text-purple-700">Rs. {cartTotal}</b></p>
        <Link href="/checkout" className="bg-purple-700 text-white px-6 py-2.5 rounded-full font-medium">
          Checkout
        </Link>
      </div>
    </main>
  );
}
