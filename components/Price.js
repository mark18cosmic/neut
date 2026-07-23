"use client";

import { useStore } from "./store";
import { currency } from "@/lib/products";

export default function Price({ mvr, className = "" }) {
  const { currency: mode } = useStore();
  return <span className={className}>{currency(mvr, mode)}</span>;
}
