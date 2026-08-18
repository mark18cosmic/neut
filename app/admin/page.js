import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { currency } from "@/lib/products";
import { getAuditLog, getOrders, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATUS_LABELS = {
  awaiting_transfer: "Awaiting transfer",
  paid: "Paid",
  packing: "Packing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function AdminOverview() {
  const [products, orders, activity] = await Promise.all([
    getProducts({ includeUnpublished: true }),
    getOrders(),
    getAuditLog(8),
  ]);

  const live = products.filter((p) => p.published && !p.soldOut);
  const lowStock = products.filter((p) => p.published && p.stock > 0 && p.stock <= 3);
  const soldOut = products.filter((p) => p.soldOut);
  const open = orders.filter((o) => ["awaiting_transfer", "paid", "packing"].includes(o.status));
  const takings = orders
    .filter((o) => ["paid", "packing", "delivered"].includes(o.status))
    .reduce((n, o) => n + (o.subtotal || 0), 0);

  const stats = [
    { label: "Live pieces", value: live.length, hint: `${products.length} in the catalog`, href: "/admin/products" },
    { label: "Open orders", value: open.length, hint: `${orders.length} all time`, href: "/admin/orders" },
    { label: "Confirmed takings", value: currency(takings), hint: "Paid, packing & delivered", href: "/admin/orders" },
    { label: "Low stock", value: lowStock.length, hint: `${soldOut.length} sold out`, href: "/admin/products" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Studio"
        title="Overview"
        subtitle="Everything the shop is showing right now, and what needs a hand."
      />

      <div className="grid gap-4 stagger sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-olive/10 bg-cream/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-olive/25 hover:shadow-[0_12px_34px_rgba(63,74,46,0.10)]"
          >
            <p className="eyebrow text-olive/45">{s.label}</p>
            <p className="wordmark mt-2 text-4xl text-olive-deep transition-colors duration-300 group-hover:text-olive">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-olive/45">{s.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Recent orders */}
        <section className="animate-riseIn rounded-xl border border-olive/10 bg-cream/70 p-5 sm:p-6">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="wordmark text-2xl text-olive-deep">Latest orders</h2>
            <Link href="/admin/orders" className="link-grow text-sm text-olive/60">
              All orders
            </Link>
          </header>

          {orders.length === 0 ? (
            <Empty>No orders yet — they land here the moment someone checks out.</Empty>
          ) : (
            <ul className="divide-y divide-olive/10">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-olive-deep">
                      {o.customer_name}{" "}
                      <span className="text-olive/40">@{o.instagram}</span>
                    </p>
                    <p className="text-xs text-olive/45">
                      {o.reference} · {(o.items || []).length} piece
                      {(o.items || []).length === 1 ? "" : "s"} · {o.island}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-serif text-lg text-olive">{currency(o.subtotal)}</p>
                    <p className="text-[0.68rem] text-olive/45">{STATUS_LABELS[o.status]}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Needs attention + activity */}
        <div className="space-y-6">
          <section className="animate-riseIn rounded-xl border border-olive/10 bg-cream/70 p-5 sm:p-6">
            <h2 className="wordmark mb-4 text-2xl text-olive-deep">Needs a hand</h2>
            {lowStock.length === 0 && soldOut.length === 0 ? (
              <Empty>Stock is healthy across the catalog.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {lowStock.slice(0, 5).map((p) => (
                  <li key={p.slug} className="flex items-center justify-between gap-2">
                    <span className="truncate text-olive-deep">{p.name}</span>
                    <span className="shrink-0 rounded-full bg-clay/25 px-2.5 py-0.5 text-xs text-olive-deep">
                      {p.stock} left
                    </span>
                  </li>
                ))}
                {soldOut.slice(0, 3).map((p) => (
                  <li key={p.slug} className="flex items-center justify-between gap-2">
                    <span className="truncate text-olive/60">{p.name}</span>
                    <span className="shrink-0 rounded-full bg-olive/10 px-2.5 py-0.5 text-xs text-olive/60">
                      Sold out
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="animate-riseIn rounded-xl border border-olive/10 bg-cream/70 p-5 sm:p-6">
            <h2 className="wordmark mb-4 text-2xl text-olive-deep">Recent activity</h2>
            {activity.length === 0 ? (
              <Empty>Edits made in the studio are logged here.</Empty>
            ) : (
              <ul className="space-y-2.5 text-xs">
                {activity.map((a) => (
                  <li key={a.id} className="flex gap-2 text-olive/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-clay" />
                    <span>
                      <span className="text-olive-deep">{a.action}</span>
                      {a.entity_id ? ` · ${a.entity_id.slice(0, 24)}` : ""}
                      <br />
                      <span className="text-olive/40">
                        {a.actor_email} · {new Date(a.created_at).toLocaleString()}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Empty({ children }) {
  return <p className="py-6 text-center text-sm text-olive/45">{children}</p>;
}
