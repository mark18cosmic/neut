import { notFound } from "next/navigation";
import ShopView from "@/components/ShopView";
import { CATEGORIES } from "@/lib/products";
import { getContent, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }) {
  const c = CATEGORIES.find((c) => c.slug === params.category);
  return { title: c ? `${c.label} — Neut` : "Shop — Neut" };
}

export default async function CategoryPage({ params }) {
  const c = CATEGORIES.find((c) => c.slug === params.category);
  if (!c) notFound();

  const [products, content] = await Promise.all([getProducts(), getContent()]);
  return <ShopView products={products} copy={content.shop} initialCategory={c.slug} />;
}
