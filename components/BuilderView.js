"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Price from "@/components/Price";
import { useStore } from "@/components/store";

// The chain arc, as a quadratic bezier in the SVG's 300x300 viewBox. Charms
// are positioned by their t along this curve so a drag always lands on the
// chain rather than floating beside it.
const ARC = { p0: [40, 60], p1: [150, 190], p2: [260, 60] };

function pointAt(t) {
  const u = 1 - t;
  return [
    u * u * ARC.p0[0] + 2 * u * t * ARC.p1[0] + t * t * ARC.p2[0],
    u * u * ARC.p0[1] + 2 * u * t * ARC.p1[1] + t * t * ARC.p2[1],
  ];
}

/** t of the point on the arc closest to (x, y), in viewBox units. */
function nearestT(x, y) {
  let best = 0.5;
  let bestD = Infinity;
  for (let i = 0; i <= 240; i++) {
    const t = i / 240;
    const [px, py] = pointAt(t);
    const d = (px - x) ** 2 + (py - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best;
}

const T_MIN = 0.08;
const T_MAX = 0.92;
const clampT = (t) => Math.min(T_MAX, Math.max(T_MIN, t));

/** Evenly spaced slots so a newly clipped charm never lands on top of another. */
function defaultT(index, count) {
  if (count <= 1) return 0.5;
  return T_MIN + ((T_MAX - T_MIN) * index) / (count - 1);
}

export default function BuilderView({ chains = [], charms: catalog = [] }) {
  const { addItem } = useStore();
  const [chain, setChain] = useState(chains[0] || null);
  const [metal, setMetal] = useState("gold");
  const [charms, setCharms] = useState([]);
  // slug -> t along the arc. Set when a charm is clipped on, then owned by
  // whatever the customer drags it to.
  const [spots, setSpots] = useState({});
  const [dragging, setDragging] = useState(null);
  const [added, setAdded] = useState(false);
  const stageRef = useRef(null);

  // Pointer position -> t, using the stage box so it works at any size and on
  // touch as well as mouse.
  const tFromPointer = useCallback((e) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return null;
    const x = ((e.clientX - box.left) / box.width) * 300;
    const y = ((e.clientY - box.top) / box.height) * 300;
    return clampT(nearestT(x, y));
  }, []);

  function moveCharm(slug, t) {
    setSpots((prev) => ({ ...prev, [slug]: clampT(t) }));
  }

  function onCharmPointerDown(e, slug) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(slug);
  }

  function onCharmPointerMove(e, slug) {
    if (dragging !== slug) return;
    const t = tFromPointer(e);
    if (t !== null) moveCharm(slug, t);
  }

  function endDrag(e) {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(null);
  }

  // Arrow keys nudge along the chain, so the arrangement is reachable without
  // a pointer.
  function onCharmKeyDown(e, slug) {
    const step = e.shiftKey ? 0.1 : 0.03;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      moveCharm(slug, (spots[slug] ?? 0.5) - step);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      moveCharm(slug, (spots[slug] ?? 0.5) + step);
    }
  }

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
        setSpots(({ [charm.slug]: _gone, ...rest }) => rest);
        return prev.filter((c) => c.slug !== charm.slug);
      }
      if (prev.length >= 5) return prev;
      // Drop it into the first free slot so it never lands on a charm that is
      // already hanging; the customer can drag it from there.
      setSpots((current) => {
        const taken = new Set(
          Object.values(current).map((t) =>
            Math.round(((t - T_MIN) / (T_MAX - T_MIN)) * 4)
          )
        );
        let slot = 0;
        while (slot < 4 && taken.has(slot)) slot++;
        return { ...current, [charm.slug]: defaultT(slot, 5) };
      });
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
            ref={stageRef}
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
            {/* hanging charms — drag along the chain to arrange */}
            {charms.length === 0 && (
              <span className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 font-serif text-lg text-cream/70">
                Add charms to build your piece
              </span>
            )}
            {charms.map((c) => {
              const t = spots[c.slug] ?? 0.5;
              const [x, y] = pointAt(t);
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-label={`${c.name} — drag or use arrow keys to move it along the chain`}
                  title={`${c.name} — drag to move`}
                  onPointerDown={(e) => onCharmPointerDown(e, c.slug)}
                  onPointerMove={(e) => onCharmPointerMove(e, c.slug)}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={(e) => onCharmKeyDown(e, c.slug)}
                  className={`animate-popIn absolute flex touch-none flex-col items-center focus:outline-none ${
                    dragging === c.slug ? "z-10 cursor-grabbing" : "cursor-grab"
                  }`}
                  style={{
                    left: `${(x / 300) * 100}%`,
                    top: `${(y / 300) * 100}%`,
                    transform: "translate(-50%, -6px)",
                  }}
                >
                  {/* jump ring */}
                  <span className="h-3 w-px bg-cream/50" />
                  <span
                    className={`h-12 w-12 rounded-full ring-2 transition ${
                      dragging === c.slug
                        ? "scale-110 ring-cream/90 shadow-lg"
                        : "ring-cream/40"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${c.tone[1]}, ${c.tone[0]})` }}
                  />
                </button>
              );
            })}
          </div>
          {charms.length > 0 && (
            <p className="mt-2 text-center text-xs text-olive/50">
              Drag a charm along the chain to arrange it.
            </p>
          )}
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
