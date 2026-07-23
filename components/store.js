"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState("MVR");
  const [ready, setReady] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("neut-cart") || "[]");
      const cur = localStorage.getItem("neut-currency") || "MVR";
      setCart(Array.isArray(c) ? c : []);
      setCurrency(cur);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("neut-cart", JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("neut-currency", currency);
  }, [currency, ready]);

  function addItem(item) {
    setCart((prev) => {
      const key = `${item.slug}-${item.metal || ""}`;
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + (item.qty || 1) } : i
        );
      }
      return [...prev, { ...item, key, qty: item.qty || 1 }];
    });
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }

  function setQty(key, qty) {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function clear() {
    setCart([]);
  }

  const count = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);
  const subtotal = useMemo(
    () => cart.reduce((n, i) => n + i.price * i.qty, 0),
    [cart]
  );

  const value = {
    cart,
    count,
    subtotal,
    currency,
    setCurrency,
    addItem,
    removeItem,
    setQty,
    clear,
    ready,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
