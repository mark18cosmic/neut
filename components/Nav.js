"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { useStore } from "./store";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop/necklaces", label: "Necklaces" },
  { href: "/shop/bracelets", label: "Bracelets" },
  { href: "/shop/charms", label: "Charms" },
  { href: "/builder", label: "Charm Builder" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const { count, currency, setCurrency } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-chrome/95 text-cream backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4">
          <button
            className="text-cream/80 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Logo size={40} />
            <span className="wordmark hidden text-2xl sm:inline">neut</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.82rem] tracking-wide text-cream/75 transition hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex overflow-hidden rounded-full border border-cream/25 text-[0.7rem]">
            {["MVR", "USD"].map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 transition ${
                  currency === c ? "bg-cream text-chrome" : "text-cream/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Link href="/cart" className="relative flex items-center gap-1.5 text-cream/85 hover:text-cream">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[0.6rem] font-medium text-chrome">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-cream/10 px-5 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-cream/80"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
