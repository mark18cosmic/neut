"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

/**
 * Live miniature of the storefront hero, redrawn as you type.
 *
 * It mirrors app/page.js — same overlay maths, same fallback wash — so what
 * the studio shows is what the shop renders.
 */
export default function HeroPreview({ hero }) {
  const [device, setDevice] = useState("desktop");
  const [a, b] = hero.tone?.length === 2 ? hero.tone : ["#5A6642", "#B79B75"];
  const overlay = hero.overlay ?? 35;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="eyebrow text-olive/40">Live preview</span>
        <div className="flex gap-1 rounded-full bg-ivory p-0.5 text-xs">
          {["desktop", "mobile"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`rounded-full px-3 py-1 capitalize transition duration-300 ${
                device === d ? "bg-olive text-cream" : "text-olive/55 hover:text-olive-deep"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center rounded-lg bg-ivory p-3">
        <div
          className={`relative overflow-hidden rounded-md transition-all duration-500 ${
            device === "mobile" ? "aspect-[9/16] w-[220px]" : "aspect-[16/9] w-full"
          }`}
        >
          {hero.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 120% at 25% 20%, ${b} 0%, ${a} 55%, #2E3621 100%)`,
              }}
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(23,23,18,${
                overlay / 140
              }), transparent 45%, rgba(23,23,18,${overlay / 100}))`,
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-cream">
            {hero.showLogo && <Logo size={device === "mobile" ? 26 : 34} className="mx-auto" />}
            {hero.eyebrow && (
              <p className="eyebrow mt-2 text-[0.5rem] text-cream/70">{hero.eyebrow}</p>
            )}
            <p
              className={`wordmark mt-2 leading-none ${
                device === "mobile" ? "text-lg" : "text-2xl sm:text-3xl"
              }`}
            >
              {hero.headingTop}
              {hero.headingBottom && (
                <>
                  <br />
                  {hero.headingBottom}
                </>
              )}
            </p>
            {hero.subtext && (
              <p className="mt-2 max-w-[80%] text-[0.6rem] leading-snug text-cream/80">
                {hero.subtext}
              </p>
            )}
            <span className="mt-3 flex flex-wrap justify-center gap-1.5">
              {hero.ctaLabel && (
                <span className="rounded-full bg-cream px-3 py-1 text-[0.55rem] text-olive-deep">
                  {hero.ctaLabel}
                </span>
              )}
              {hero.secondaryLabel && (
                <span className="rounded-full border border-cream/60 px-3 py-1 text-[0.55rem]">
                  {hero.secondaryLabel}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
