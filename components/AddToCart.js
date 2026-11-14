"use client";
import { useCart } from "./CartContext";

export default function AddToCart({ tool }) {
  const { add } = useCart();
  return <button onClick={() => add(tool)} className="btn-primary text-lg">Buy now - ${tool.price}/mo</button>;
}
