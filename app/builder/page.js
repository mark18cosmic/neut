import BuilderView from "@/components/BuilderView";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Charm Builder — Neut" };

export default async function BuilderPage() {
  const products = await getProducts();
  const chains = products.filter((p) => p.charmReady);
  const charms = products.filter((p) => p.category === "charms");

  return <BuilderView chains={chains} charms={charms} />;
}
