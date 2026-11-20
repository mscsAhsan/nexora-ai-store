"use client";
import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("nexavo-cart") || "[]")); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("nexavo-cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (tool) => {
    setItems((p) => (p.find((i) => i.slug === tool.slug) ? p : [...p, { slug: tool.slug, name: tool.name, price: tool.price, icon: tool.icon, from: tool.from, to: tool.to }]));
    setOpen(true);
  };
  const remove = (slug) => setItems((p) => p.filter((i) => i.slug !== slug));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price, 0);

  return <Ctx.Provider value={{ items, add, remove, clear, total, open, setOpen }}>{children}</Ctx.Provider>;
}
