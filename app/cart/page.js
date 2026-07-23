"use client";

import { useState } from "react";
import Link from "next/link";
import Price from "@/components/Price";
import { useStore } from "@/components/store";
import { currency } from "@/lib/products";

export default function CartPage() {
  const { cart, subtotal, removeItem, setQty, currency: mode, clear } = useStore();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", instagram: "", island: "", note: "" });

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="wordmark text-5xl text-olive-deep">Thank you</h1>
        <p className="mt-5 leading-relaxed text-olive/70">
          Your order is noted. We’ll confirm availability and share our bank
          transfer details over Instagram DM — usually within a day.
        </p>
        <div className="mt-8 rounded-lg bg-sand/40 px-6 py-5 text-left text-sm text-olive/80">
          <p className="font-medium">Next steps</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>We message <span className="font-medium">@{form.instagram || "you"}</span> to confirm.</li>
            <li>You transfer the total by bank.</li>
            <li>We hand-pack and arrange island-wide delivery.</li>
          </ol>
        </div>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-olive px-8 py-3 text-sm text-cream">
          Continue browsing
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1 className="wordmark text-5xl text-olive-deep">Your cart is quiet</h1>
        <p className="mt-4 text-olive/60">Nothing here yet — find something to love.</p>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-olive px-8 py-3 text-sm text-cream">
          Shop the collection
        </Link>
      </div>
    );
  }

  function submit(e) {
    e.preventDefault();
    setPlaced(true);
    clear();
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="wordmark mb-10 text-5xl text-olive-deep">Cart</h1>

      <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
        {/* Items */}
        <div className="divide-y divide-olive/10">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-4 py-5">
              <span
                className="h-20 w-20 shrink-0 rounded"
                style={{ background: `linear-gradient(135deg, ${item.tone?.[1] || "#B79B75"}, ${item.tone?.[0] || "#5A6642"})` }}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-serif text-xl text-olive-deep">{item.name}</p>
                    {item.metal && <p className="text-sm capitalize text-olive/50">{item.metal}</p>}
                  </div>
                  <Price mvr={item.price * item.qty} className="font-serif text-lg text-olive" />
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-3 text-olive/70">
                    <button onClick={() => setQty(item.key, item.qty - 1)} className="h-6 w-6 rounded-full border border-olive/25">−</button>
                    <span className="text-sm">{item.qty}</span>
                    <button onClick={() => setQty(item.key, item.qty + 1)} className="h-6 w-6 rounded-full border border-olive/25">+</button>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-xs text-olive/40 hover:text-olive">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <div className="rounded-lg bg-cream p-6">
          <div className="flex items-center justify-between border-b border-olive/10 pb-4">
            <span className="text-olive/70">Subtotal</span>
            <span className="font-serif text-2xl text-olive-deep">{currency(subtotal, mode)}</span>
          </div>
          <p className="mt-3 text-xs text-olive/50">
            Delivery arranged after we confirm. Payment by bank transfer.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Instagram handle" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} placeholder="@yourname" required />
            <Field label="Island / delivery area" value={form.island} onChange={(v) => setForm({ ...form, island: v })} required />
            <Field label="Note (optional)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
            <button type="submit" className="mt-2 w-full rounded-full bg-olive py-3.5 text-sm text-cream transition hover:bg-olive-deep">
              Place order — we’ll DM to confirm
            </button>
          </form>

          <a
            href="https://instagram.com/neut.co"
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-center text-xs text-olive/50 underline underline-offset-4"
          >
            or message @neut.co directly
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }) {
  return (
    <label className="block">
      <span className="eyebrow text-olive/40">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-md border border-olive/20 bg-ivory px-3 py-2.5 text-sm text-olive-deep outline-none focus:border-olive"
      />
    </label>
  );
}
