"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "../providers";
import { supabase } from "../lib/supabase";

export default function Orders() {
  const { user, authReady } = useApp();
  const [orders, setOrders] = useState(null);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    setPlaced(new URLSearchParams(window.location.search).get("placed") === "1");
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, [user]);

  if (!authReady) return <main className="p-6 text-black">Loading...</main>;
  if (!user) {
    return (
      <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl text-black">
        Please <Link href="/login" className="text-purple-700 underline">login</Link> to see your orders.
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 mt-4">
      <h1 className="text-2xl font-bold text-black">My orders</h1>
      {placed && (
        <p className="mt-3 bg-purple-100 text-purple-900 rounded-2xl p-3">
          Order placed. We will contact you to confirm delivery. 🐾
        </p>
      )}
      {orders === null && <p className="mt-4 text-gray-500">Loading...</p>}
      {orders && orders.length === 0 && (
        <p className="mt-4 text-gray-500">
          No orders yet. <Link href="/products" className="text-purple-700 underline">Start shopping</Link>
        </p>
      )}
      <div className="mt-4 space-y-3">
        {(orders || []).map((o) => (
          <div key={o.id} className="bg-white rounded-2xl p-4 text-black">
            <div className="flex justify-between flex-wrap gap-2">
              <b>Order #{o.id}</b>
              <span className="text-sm bg-purple-100 text-purple-900 rounded-full px-3 py-0.5">{o.status}</span>
            </div>
            <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</p>
            <div className="mt-2 text-sm">
              {o.order_items.map((i) => (
                <div key={i.id} className="flex justify-between py-0.5">
                  <span>{i.name} × {i.qty}</span>
                  <span>Rs. {i.price * i.qty}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 font-bold text-right text-purple-700">Total: Rs. {o.total}</p>
            <p className="text-xs text-gray-500">Deliver to: {o.full_name}, {o.phone}, {o.address}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
