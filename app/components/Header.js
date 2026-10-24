"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";
import { supabase } from "../lib/supabase";

export default function Header() {
  const { user, cartCount } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");

  function search(e) {
    e.preventDefault();
    router.push("/products?q=" + encodeURIComponent(q.trim()));
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const tabs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Adopt", href: "/adopt" },
    { label: "Post a Pet", href: "/adopt/new" },
  ];
  if (user) {
    tabs.push({ label: "My Pets", href: "/my-pets" });
    tabs.push({ label: "My Orders", href: "/orders" });
  }

  const name = user && user.user_metadata && user.user_metadata.owner_name;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <Link href="/" className="text-xl md:text-2xl font-extrabold text-purple-700">
          KiritoPaws 🐾
        </Link>
        <form onSubmit={search} className="order-last md:order-none w-full md:w-auto md:flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pet food, toys, beds..."
            className="w-full bg-purple-50 border border-purple-200 rounded-full px-4 py-2 text-black outline-none focus:border-purple-400"
          />
        </form>
        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <Link href="/cart" className="relative bg-purple-100 text-purple-900 rounded-full px-3 py-2 text-sm">
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={logout} className="bg-purple-700 text-white px-4 py-2 rounded-full text-sm">
              Logout{name ? " (" + name + ")" : ""}
            </button>
          ) : (
            <Link href="/login" className="bg-purple-700 text-white px-4 py-2 rounded-full text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
      <nav className="bg-purple-100">
        <div className="max-w-6xl mx-auto px-2 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-4 py-2.5 text-sm text-purple-900 hover:bg-purple-200 rounded-t-2xl whitespace-nowrap"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
