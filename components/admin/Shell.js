"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Overview", icon: "M3 12h6v9H3zM10 3h4v18h-4zM15 8h6v13h-6z" },
  { href: "/admin/content", label: "Content & hero", icon: "M4 4h16v5H4zM4 12h10v8H4zM16 12h4v8h-4z" },
  { href: "/admin/products", label: "Products", icon: "M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8" },
  { href: "/admin/journal", label: "Journal", icon: "M5 3h11l4 4v14H5zM16 3v4h4" },
  { href: "/admin/orders", label: "Orders", icon: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
];

export default function Shell({ admin, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const items = NAV.map((item, i) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setOpen(false)}
      style={{ animationDelay: `${i * 55}ms` }}
      className={`group flex animate-slideInLeft items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition duration-300 ${
        isActive(item.href)
          ? "bg-cream/15 text-cream"
          : "text-cream/60 hover:bg-cream/10 hover:text-cream"
      }`}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
      >
        <path d={item.icon} />
      </svg>
      <span>{item.label}</span>
      <span
        className={`ml-auto h-1.5 w-1.5 rounded-full bg-clay transition-opacity duration-300 ${
          isActive(item.href) ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  ));

  return (
    <div className="flex min-h-screen flex-col bg-ivory md:flex-row">
      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-chrome px-4 py-3 text-cream md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo size={30} />
          <span className="wordmark text-lg">studio</span>
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Studio menu"
          aria-expanded={open}
          className="rounded-md p-1.5 text-cream/80 transition hover:bg-cream/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={open ? "M6 6l12 12M18 6L6 18" : "M3 6h18M3 12h18M3 18h18"} />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="animate-riseIn space-y-1 border-b border-cream/10 bg-chrome px-3 pb-4 text-cream md:hidden">
          {items}
          <SignOut />
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-chrome px-4 py-6 text-cream md:sticky md:top-0 md:flex md:h-screen">
        <Link href="/admin" className="mb-8 flex items-center gap-3 px-2">
          <Logo size={38} />
          <span>
            <span className="wordmark block text-xl leading-none">neut</span>
            <span className="eyebrow text-[0.55rem] text-cream/45">studio</span>
          </span>
        </Link>

        <nav className="space-y-1">{items}</nav>

        <div className="mt-auto space-y-3 border-t border-cream/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="link-grow block px-3 text-xs text-cream/55 hover:text-cream"
          >
            View the shop ↗
          </Link>
          <div className="px-3">
            <p className="truncate text-xs text-cream/70">{admin?.name || admin?.email}</p>
            <p className="eyebrow text-[0.55rem] text-cream/35">{admin?.role}</p>
          </div>
          <SignOut />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function SignOut() {
  return (
    <form action={signOut} className="px-3 md:px-0">
      <button
        type="submit"
        className="w-full rounded-lg px-3 py-2 text-left text-sm text-cream/55 transition duration-300 hover:bg-cream/10 hover:text-cream"
      >
        Sign out
      </button>
    </form>
  );
}
