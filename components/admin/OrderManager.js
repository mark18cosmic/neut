"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import { Badge, Button, Toast, inputClass } from "./ui";
import { currency } from "@/lib/products";
import { setOrderStatus } from "@/app/admin/actions";

const FLOW = [
  { key: "awaiting_transfer", label: "Awaiting transfer", tone: "clay" },
  { key: "paid", label: "Paid", tone: "sand" },
  { key: "packing", label: "Packing", tone: "sand" },
  { key: "delivered", label: "Delivered", tone: "olive" },
  { key: "cancelled", label: "Cancelled", tone: "muted" },
];

const LABEL = Object.fromEntries(FLOW.map((s) => [s.key, s.label]));
const TONE = Object.fromEntries(FLOW.map((s) => [s.key, s.tone]));

export default function OrderManager({ initial }) {
  const router = useRouter();
  const [status, setStatus] = useState("open");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pending, setPending] = useState(null);
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initial.filter((o) => {
      if (status === "open" && !["awaiting_transfer", "paid", "packing"].includes(o.status)) return false;
      if (status !== "open" && status !== "all" && o.status !== status) return false;

      const day = o.created_at.slice(0, 10);
      if (from && day < from) return false;
      if (to && day > to) return false;

      if (!q) return true;
      return `${o.reference} ${o.customer_name} ${o.instagram} ${o.island}`.toLowerCase().includes(q);
    });
  }, [initial, status, query, from, to]);

  const total = results.reduce((n, o) => n + (o.subtotal || 0), 0);

  async function move(order, next) {
    setPending(order.id);
    const result = await setOrderStatus(order.id, next);
    setPending(null);
    if (result.ok) {
      setToast({ message: `${order.reference} → ${LABEL[next]}`, tone: "ok" });
      router.refresh();
    } else {
      setToast({ message: result.error, tone: "error" });
    }
  }

  const tabs = [{ key: "open", label: "Open" }, ...FLOW, { key: "all", label: "All" }];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Studio"
        title="Orders"
        subtitle="Orders placed at checkout. Prices are recorded at the time of the order, so history stays accurate."
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 border-y border-olive/10 py-4">
        <div className="scroll-x flex gap-2 pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition duration-300 ${
                status === t.key ? "bg-olive text-cream" : "bg-cream text-olive/65 hover:bg-sand/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, handle, island…"
            className={`${inputClass} sm:w-64`}
          />
          <label className="flex items-center gap-2 text-xs text-olive/50">
            From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
          </label>
          <label className="flex items-center gap-2 text-xs text-olive/50">
            To
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
          </label>
          <span className="ml-auto text-sm text-olive/55">
            {results.length} order{results.length === 1 ? "" : "s"} · {currency(total)}
          </span>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-20 text-center font-serif text-2xl text-olive/45">
          No orders in this view.
        </p>
      ) : (
        <div className="space-y-3 stagger">
          {results.map((o) => {
            const open = expanded === o.id;
            return (
              <article
                key={o.id}
                className={`rounded-xl border border-olive/10 bg-cream/70 transition duration-300 ${
                  pending === o.id ? "opacity-55" : "hover:border-olive/25"
                }`}
              >
                <button
                  onClick={() => setExpanded(open ? null : o.id)}
                  aria-expanded={open}
                  className="flex w-full flex-wrap items-center gap-3 px-4 py-3.5 text-left sm:px-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-lg text-olive-deep">
                      {o.customer_name}{" "}
                      <span className="text-sm text-olive/40">@{o.instagram}</span>
                    </span>
                    <span className="block text-xs text-olive/45">
                      {o.reference} · {o.island} · {new Date(o.created_at).toLocaleDateString()}
                    </span>
                  </span>
                  <Badge tone={TONE[o.status]}>{LABEL[o.status]}</Badge>
                  <span className="font-serif text-xl text-olive">{currency(o.subtotal)}</span>
                  <span
                    className={`text-olive/35 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                {open && (
                  <div className="animate-riseIn border-t border-olive/10 px-4 py-4 sm:px-5">
                    <ul className="divide-y divide-olive/10 text-sm">
                      {(o.items || []).map((item, i) => (
                        <li key={i} className="flex items-center justify-between py-2">
                          <span className="text-olive-deep">
                            {item.name}
                            {item.metal && <span className="text-olive/45"> · {item.metal}</span>}
                            <span className="text-olive/45"> × {item.qty}</span>
                          </span>
                          <span className="text-olive/65">{currency(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>

                    {o.note && (
                      <p className="mt-3 rounded-lg bg-ivory px-3 py-2 text-sm text-olive/70">
                        “{o.note}”
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="eyebrow mr-1 text-olive/40">Move to</span>
                      {FLOW.filter((s) => s.key !== o.status).map((s) => (
                        <Button key={s.key} variant="ghost" onClick={() => move(o, s.key)}>
                          {s.label}
                        </Button>
                      ))}
                      <a
                        href={`https://instagram.com/${o.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="link-grow ml-auto text-xs text-olive/55"
                      >
                        Message @{o.instagram} ↗
                      </a>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
}
