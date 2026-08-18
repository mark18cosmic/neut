"use client";

import { useState } from "react";
import Link from "next/link";
import Price from "@/components/Price";
import { useStore } from "@/components/store";

export default function BuilderView({ chains = [], charms: catalog = [] }) {
  const { addItem } = useStore();
  const [chain, setChain] = useState(chains[0] || null);
  const [metal, setMetal] = useState("gold");
  const [charms, setCharms] = useState([]);
  const [added, setAdded] = useState(false);

  const available = catalog.filter((c) => !c.soldOut);
  const total = (chain?.price || 0) + charms.reduce((n, c) => n + c.price, 0);

  if (!chain) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1 className="wordmark text-5xl text-olive-deep">Builder is resting</h1>
        <p className="mt-4 text-olive/60">
          No chains are available right now — check back after the next drop.
        </p>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-olive px-8 py-3 text-sm text-cream">
          Shop the collection
        </Link>
      </div>
    );
  }

  function toggleCharm(charm) {
    setCharms((prev) => {
      if (prev.find((c) => c.slug === charm.slug)) {
        return prev.filter((c) => c.slug !== charm.slug);
      }
      if (prev.length >= 5) return prev;
      return [...prev, charm];
    });
  }

  function addToCart() {
    addItem({ slug: chain.slug, name: chain.name, price: chain.price, metal, tone: chain.tone, image: chain.image });
    charms.forEach((c) =>
      addItem({ slug: c.slug, name: c.name, price: c.price, metal, tone: c.tone, image: c.image })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="mb-10 animate-riseIn text-center">
        <p className="eyebrow text-clay">Make it yours</p>
        <h1 className="wordmark mt-2 text-5xl text-olive-deep">Charm Builder</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-olive/60">
          Choose a chain, then clip on the charms you love — the way they layer on driftwood.
        </p>
      </header>

      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr]">
        {/* Preview */}
        <div className="md:sticky md:top-24 md:self-start">
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg"
            style={{
              background: `radial-gradient(120% 120% at 30% 20%, ${chain.tone[1]}, ${chain.tone[0]} 55%, #2E3621)`,
            }}
          >
            {/* chain arc */}
            <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
              <path
                d="M40 60 Q150 190 260 60"
                fill="none"
                stroke={metal === "gold" ? "#E4C98B" : "#D8DBE0"}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
            {/* hanging charms */}
            <div className="absolute left-1/2 top-[38%] flex -translate-x-1/2 gap-3">
              {charms.length === 0 && (
                <span className="mt-8 font-serif text-lg text-cream/70">
                  Add charms to build your piece
                </span>
              )}
              {charms.map((c, i) => (
                <div
                  key={c.slug}
                  className="animate-popIn flex flex-col items-center"
                  style={{ marginTop: i % 2 ? 22 : 0 }}
                >
                  <span className="h-px w-px" />
                  <span
                    className="h-12 w-12 rounded-full ring-2 ring-cream/40"
                    style={{ background: `linear-gradient(135deg, ${c.tone[1]}, ${c.tone[0]})` }}
                    title={c.name}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="font-serif text-2xl text-olive-deep">{chain.name}</p>
              <p className="text-sm text-olive/55">
                {charms.length} charm{charms.length === 1 ? "" : "s"} · {metal}
              </p>
            </div>
            <p className="font-serif text-2xl text-olive"><Price mvr={total} /></p>
          </div>
          <button
            onClick={addToCart}
            className="mt-4 w-full rounded-full bg-olive py-3.5 text-sm text-cream transition duration-300 hover:bg-olive-deep hover:shadow-lg"
          >
            {added ? "Added to cart ✓" : "Add this stack to cart"}
          </button>
        </div>

        {/* Options */}
        <div>
          <section>
            <p className="eyebrow mb-3 text-olive/40">1 · Choose a base</p>
            <div className="grid grid-cols-2 gap-3 stagger">
              {chains.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setChain(c)}
                  className={`rounded-lg border p-3 text-left transition ${
                    chain.slug === c.slug ? "border-olive bg-sand/40" : "border-olive/15 hover:border-olive/40"
                  }`}
                >
                  <span
                    className="mb-2 block h-16 w-full rounded"
                    style={{ background: `linear-gradient(135deg, ${c.tone[1]}, ${c.tone[0]})` }}
                  />
                  <span className="font-serif text-lg text-olive-deep">{c.name}</span>
                  <Price mvr={c.price} className="block text-sm text-olive/55" />
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <p className="eyebrow mb-3 text-olive/40">2 · Finish</p>
            <div className="flex gap-2">
              {["gold", "silver"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMetal(m)}
                  className={`rounded-full border px-5 py-2 text-sm capitalize transition ${
                    metal === m ? "border-olive bg-olive text-cream" : "border-olive/25 text-olive/70"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <p className="eyebrow mb-3 text-olive/40">3 · Add charms (up to 5)</p>
            <div className="grid grid-cols-2 gap-3 stagger sm:grid-cols-3">
              {available.map((c) => {
                const on = charms.find((x) => x.slug === c.slug);
                return (
                  <button
                    key={c.slug}
                    onClick={() => toggleCharm(c)}
                    className={`rounded-lg border p-3 text-left transition ${
                      on ? "border-olive bg-sand/40" : "border-olive/15 hover:border-olive/40"
                    }`}
                  >
                    <span
                      className="mb-2 block h-14 w-full rounded"
                      style={{ background: `linear-gradient(135deg, ${c.tone[1]}, ${c.tone[0]})` }}
                    />
                    <span className="text-sm text-olive-deep">{c.name}</span>
                    <Price mvr={c.price} className="block text-xs text-olive/50" />
                  </button>
                );
              })}
            </div>
          </section>

          <p className="mt-6 text-xs text-olive/50">
            Prefer help styling it? <Link href="/about" className="underline">Message us on Instagram</Link> and we’ll build it with you.
          </p>
        </div>
      </div>
    </div>
  );
}
