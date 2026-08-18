import ShopView from "@/components/ShopView";
import { getContent, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop — Neut" };

export default async function ShopPage() {
  const [products, content] = await Promise.all([getProducts(), getContent()]);
  return <ShopView products={products} copy={content.shop} />;
}
