"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { CATEGORIES, METALS, MATERIALS } from "@/lib/products";
import { DEFAULT_CONTENT } from "@/lib/site";

export default function ShopView({
  products = [],
  copy = DEFAULT_CONTENT.shop,
  initialCategory = null,
}) {
  const [category, setCategory] = useState(initialCategory);
  const [metal, setMetal] = useState(null);
  const [material, setMaterial] = useState(null);

  const results = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (metal && !p.metals.includes(metal)) return false;
      if (material && !p.materials.includes(material)) return false;
      return true;
    });
  }, [products, category, metal, material]);

  const active = category
    ? CATEGORIES.find((c) => c.slug === category)?.label
    : "Everything";

  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <header className="mb-10 animate-riseIn text-center">
        <p className="eyebrow text-clay">{copy.eyebrow}</p>
        <h1 className="wordmark mt-2 text-5xl text-olive-deep">{active}</h1>
      </header>

      {/* Filters */}
      <div className="mb-12 flex flex-col gap-5 border-y border-olive/10 py-5 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={!category} onClick={() => setCategory(null)}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <FilterGroup label="Metal" value={metal} options={METALS} onChange={setMetal} />
          <FilterGroup label="Material" value={material} options={MATERIALS} onChange={setMaterial} />
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-20 text-center font-serif text-2xl text-olive/50">
          {copy.emptyText}
        </p>
      ) : (
        <div key={`${category}-${metal}-${material}`} className="grid grid-cols-2 gap-x-5 gap-y-12 stagger md:grid-cols-3">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      {category === "charms" && (
        <div className="mt-16 animate-riseIn rounded-lg bg-olive px-8 py-10 text-center text-cream">
          <p className="wordmark text-3xl">{copy.charmsTitle}</p>
          <p className="mt-2 text-sm text-cream/75">{copy.charmsBody}</p>
          <Link
            href="/builder"
            className="mt-6 inline-block rounded-full bg-cream px-7 py-2.5 text-sm text-olive-deep transition hover:bg-ivory"
          >
            Open the charm builder
          </Link>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 transition ${
        active ? "bg-olive text-cream" : "bg-cream text-olive/70 hover:bg-sand/60"
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow text-olive/40">{label}</span>
      <div className="flex gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(value === o ? null : o)}
            className={`rounded-full border px-2.5 py-1 text-xs capitalize transition ${
              value === o
                ? "border-olive bg-olive text-cream"
                : "border-olive/20 text-olive/60 hover:border-olive/50"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
