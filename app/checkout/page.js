"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useApp } from "../providers";

export default function Checkout() {
  const { user, authReady, cart, cartTotal, clearCart } = useApp();
  const router = useRouter();
  const [f, setF] = useState({ name: "", phone: "", address: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const box = "w-full border border-purple-200 rounded-xl px-3 py-2 text-black mb-3 bg-purple-50 outline-none focus:border-purple-400";

  if (!authReady) return <main className="p-6 text-black">Loading...</main>;

  if (!user) {
    return (
      <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl text-black">
        Please <Link href="/login" className="text-purple-700 underline">login</Link> to place your order.
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl text-black">
        Your cart is empty. <Link href="/products" className="text-purple-700 underline">Go shopping</Link>
      </main>
    );
  }

  async function placeOrder() {
    if (!f.name.trim() || !f.phone.trim() || !f.address.trim()) {
      setMsg("Please fill in your name, phone and address.");
      return;
    }
    setBusy(true);
    setMsg("");
    const { error } = await supabase.rpc("place_order", {
      p_name: f.name.trim(),
      p_phone: f.phone.trim(),
      p_address: f.address.trim(),
      p_items: cart.map((i) => ({ id: i.id, qty: i.qty })),
    });
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    clearCart();
    router.push("/orders?placed=1");
  }

  return (
    <main className="max-w-4xl mx-auto px-4 mt-4 grid md:grid-cols-2 gap-4">
      <section className="bg-white rounded-2xl p-5">
        <h1 className="text-xl font-bold text-black mb-4">Delivery details</h1>
        <input className={box} placeholder="Full name" value={f.name} onChange={set("name")} />
        <input className={box} placeholder="Phone number" value={f.phone} onChange={set("phone")} />
        <textarea className={box} rows={3} placeholder="Delivery address" value={f.address} onChange={set("address")} />
        <p className="text-sm text-gray-500 mb-3">Payment: cash on delivery</p>
        <button
          onClick={placeOrder}
          disabled={busy}
          className="w-full bg-purple-700 text-white py-2.5 rounded-full font-medium disabled:opacity-60"
        >
          {busy ? "Placing order..." : "Place order"}
        </button>
        {msg && <p className="mt-3 text-sm text-black">{msg}</p>}
      </section>
      <section className="bg-white rounded-2xl p-5 h-fit">
        <h2 className="text-lg font-bold text-black mb-3">Order summary</h2>
        {cart.map((i) => (
          <div key={i.id} className="flex justify-between text-sm text-black py-1">
            <span>{i.name} × {i.qty}</span>
            <span>Rs. {i.price * i.qty}</span>
          </div>
        ))}
        <div className="border-t border-purple-100 mt-3 pt-3 flex justify-between font-bold text-black">
          <span>Total</span>
          <span className="text-purple-700">Rs. {cartTotal}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Final prices are confirmed by the server when you place the order.</p>
      </section>
    </main>
  );
}
