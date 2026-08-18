"use server";

import { getServerClient } from "@/lib/supabase/server";

/**
 * Public checkout. Anonymous visitors may insert an order (RLS allows insert
 * only), but never read one back — the admin studio is the only reader.
 *
 * Totals are recomputed here from the submitted line items rather than trusted
 * from the client, and every price is re-read from the catalog so a tampered
 * cart cannot set its own prices.
 */
export async function placeOrder(payload) {
  const supabase = getServerClient();

  const name = String(payload?.name || "").trim();
  const instagram = String(payload?.instagram || "").trim().replace(/^@/, "");
  const island = String(payload?.island || "").trim();
  const note = String(payload?.note || "").trim().slice(0, 500);
  const rawItems = Array.isArray(payload?.items) ? payload.items : [];

  if (!name || !instagram || !island) {
    return { ok: false, error: "Name, Instagram handle and island are all required." };
  }
  if (rawItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  // Without Supabase the storefront still works — the order simply isn't stored.
  if (!supabase) {
    return { ok: true, reference: null, stored: false };
  }

  const slugs = [...new Set(rawItems.map((i) => String(i.slug)))];
  const { data: catalog, error: catalogError } = await supabase
    .from("products")
    .select("slug, name, price, sold_out, stock")
    .in("slug", slugs);

  if (catalogError) {
    return { ok: false, error: "We couldn't reach the catalog. Please try again." };
  }

  const bySlug = new Map((catalog || []).map((p) => [p.slug, p]));
  const items = [];
  let subtotal = 0;

  for (const raw of rawItems) {
    const product = bySlug.get(String(raw.slug));
    if (!product) continue; // silently drop pieces that no longer exist
    const qty = Math.max(1, Math.min(20, Number(raw.qty) || 1));
    const line = {
      slug: product.slug,
      name: product.name,
      metal: raw.metal ? String(raw.metal) : null,
      qty,
      price: product.price, // authoritative price, not the client's
    };
    items.push(line);
    subtotal += product.price * qty;
  }

  if (items.length === 0) {
    return { ok: false, error: "None of these pieces are available any more." };
  }

  const { data: refRow } = await supabase.rpc("next_order_reference");
  const reference = refRow || `NE-${Date.now().toString().slice(-6)}`;

  const { error } = await supabase.from("orders").insert({
    reference,
    customer_name: name,
    instagram,
    island,
    note,
    items,
    subtotal,
  });

  if (error) {
    return { ok: false, error: "We couldn't save your order. Message us on Instagram instead." };
  }

  return { ok: true, reference, stored: true };
}
