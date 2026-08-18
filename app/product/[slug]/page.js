import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const p = await getProduct(params.slug);
  return { title: p ? `${p.name} — Neut` : "Neut" };
}

export default async function ProductPage({ params }) {
  const [product, products] = await Promise.all([getProduct(params.slug), getProducts()]);
  if (!product) notFound();

  const charms = products.filter((p) => p.category === "charms" && !p.soldOut);
  return <ProductDetail product={product} charms={charms} />;
}
