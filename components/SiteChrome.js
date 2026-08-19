"use client";

import { usePathname } from "next/navigation";

/**
 * Storefront header, announcement, and footer.
 *
 * The studio at /admin brings its own shell and navigation, so the shop
 * chrome is hidden there — it would otherwise sit on top of the admin nav and
 * offer customers' links to someone working orders.
 */
export default function SiteChrome({ announcement, nav, footer, children }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/admin");

  if (bare) return <main className="min-h-screen">{children}</main>;

  return (
    <>
      {announcement}
      {nav}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  );
}
