import ProductManager from "@/components/admin/ProductManager";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products — Neut Studio" };

export default async function ProductsPage() {
  const products = await getProducts({ includeUnpublished: true });
  return <ProductManager initial={products} />;
}
