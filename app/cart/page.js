import CartView from "@/components/CartView";
import { getContent } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cart — Neut" };

export default async function CartPage() {
  const content = await getContent();
  return <CartView copy={content.checkout} instagram={content.footer.instagram || "neut.co"} />;
}
