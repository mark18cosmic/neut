"use client";

import { useState } from "react";
import Link from "next/link";
import Photo from "./Photo";
import Price from "./Price";
import { useStore } from "./store";

export default function ProductDetail({ product, charms = [] }) {
  const { addItem } = useStore();
  const [metal, setMetal] = useState(product.metals[0]);
  const [added, setAdded] = useState(false);
  const [addCharm, setAddCharm] = useState(null);

  const upsells = product.charmReady
    ? charms.filter((c) => !c.soldOut && c.slug !== product.slug).slice(0, 4)
    : [];
  const [main, ...extra] = [product.image, ...(product.gallery || [])].filter(Boolean);

  function handleAdd() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      metal,
      tone: product.tone,
      image: product.image,
    });
    if (addCharm) {
      addItem({
        slug: addCharm.slug,
        name: addCharm.name,
        price: addCharm.price,
        metal,
        tone: addCharm.tone,
        image: addCharm.image,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link href="/shop" className="text-sm text-olive/50 hover:text-olive">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3 stagger">
          <Photo
            src={main}
            tone={product.tone}
            label={product.name}
            tall
            priority
            className="col-span-2 rounded-sm"
          />
          <Photo
            src={extra[0]}
            tone={[product.tone[1], product.tone[0]]}
            label={`${product.name} detail`}
            className="rounded-sm"
          />
          <Photo
            src={extra[1]}
            tone={["#E3D5BF", product.tone[0]]}
            label={`${product.name} worn`}
            className="rounded-sm"
          />
        </div>

        <div className="animate-riseIn md:pt-4">
          {product.drop && <p className="eyebrow text-clay">{product.drop} drop</p>}
          <h1 className="wordmark mt-2 text-5xl leading-none text-olive-deep">{product.name}</h1>
          <p className="mt-3 font-serif text-2xl text-olive/70">
            <Price mvr={product.price + (addCharm ? addCharm.price : 0)} />
          </p>

          <p className="mt-6 max-w-md leading-relaxed text-olive/75">{product.description}</p>

          {/* Metal */}
          <div className="mt-8">
            <p className="eyebrow mb-2 text-olive/40">Finish</p>
            <div className="flex gap-2">
              {product.metals.map((m) => (
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
          </div>

          {/* Charm upsell */}
          {upsells.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-2 text-olive/40">Add a charm</p>
              <div className="flex flex-wrap gap-2">
                {upsells.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setAddCharm(addCharm?.slug === c.slug ? null : c)}
                    className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition ${
                      addCharm?.slug === c.slug ? "border-olive bg-sand/50" : "border-olive/20"
                    }`}
                  >
                    <span
                      className="h-7 w-7 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${c.tone[1]}, ${c.tone[0]})` }}
                    />
                    <span className="text-olive/80">{c.name}</span>
                    <Price mvr={c.price} className="text-olive/50" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={product.soldOut}
            className={`mt-9 w-full rounded-full py-3.5 text-sm tracking-wide transition sm:w-auto sm:px-14 ${
              product.soldOut
                ? "cursor-not-allowed bg-olive/20 text-olive/40"
                : "bg-olive text-cream hover:bg-olive-deep"
            }`}
          >
            {product.soldOut ? "Sold out" : added ? "Added to cart ✓" : "Add to cart"}
          </button>

          {!product.soldOut && product.stock > 0 && product.stock <= 3 && (
            <p className="mt-3 text-xs text-clay">
              Only {product.stock} left — made in small batches.
            </p>
          )}

          <p className="mt-4 text-xs text-olive/50">
            Payment by bank transfer · order confirmed via Instagram DM · island-wide delivery
          </p>

          {/* Care */}
          <div className="mt-10 border-t border-olive/10 pt-6">
            <p className="eyebrow mb-2 text-olive/40">Care</p>
            <p className="max-w-md text-sm leading-relaxed text-olive/65">{product.care}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
