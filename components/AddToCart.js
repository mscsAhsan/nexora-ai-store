"use client";
import { useCart } from "./CartContext";
import { formatPKR } from "@/lib/format";

export default function AddToCart({ tool }) {
  const { add } = useCart();
  return <button onClick={() => add(tool)} className="btn-primary w-full text-base sm:w-auto sm:text-lg">Buy now - {formatPKR(tool.price)}/mo</button>;
}
