"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export default function Providers({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kp_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
    setCartReady(true);

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? data.session.user : null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? session.user : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    try {
      localStorage.setItem("kp_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart, cartReady]);

  function addToCart(product, qty) {
    const amount = qty || 1;
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + amount } : i));
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url, qty: amount },
      ];
    });
  }

  function setQty(id, qty) {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cart.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <AppContext.Provider
      value={{ user, authReady, cart, cartCount, cartTotal, addToCart, setQty, removeFromCart, clearCart }}
    >
      {children}
    </AppContext.Provider>
  );
}
