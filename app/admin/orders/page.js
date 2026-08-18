import OrderManager from "@/components/admin/OrderManager";
import { getOrders } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders — Neut Studio" };

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrderManager initial={orders} />;
}
