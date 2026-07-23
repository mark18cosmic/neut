import { notFound } from "next/navigation";
import ShopView from "@/components/ShopView";
import { CATEGORIES } from "@/lib/products";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const c = CATEGORIES.find((c) => c.slug === params.category);
  return { title: c ? `${c.label} — Neut` : "Shop — Neut" };
}

export default function CategoryPage({ params }) {
  const c = CATEGORIES.find((c) => c.slug === params.category);
  if (!c) notFound();
  return <ShopView initialCategory={c.slug} />;
}
