import { getServerClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT, withDefaults } from "@/lib/site";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/lib/products";

// Storefront reads are always fresh so an admin edit shows up immediately.
export const dynamic = "force-dynamic";

const FALLBACK_JOURNAL = [
  {
    slug: "low-tide",
    title: "Low Tide",
    tag: "New Drop",
    dateline: "July 2026",
    tone: ["#5A6642", "#B79B75"],
    image: null,
    body: "Our warm-season drop — lockets, cowrie and driftwood charms gathered along the reef. Small batch, as always.",
  },
  {
    slug: "how-to-layer",
    title: "How to layer",
    tag: "Charm",
    dateline: "June 2026",
    tone: ["#B79B75", "#3F4A2E"],
    image: null,
    body: "Start with one chain you’ll never take off. Add a charm that means something. Leave room for the next season.",
  },
  {
    slug: "a-morning-walk",
    title: "A morning walk",
    tag: "Behind the scenes",
    dateline: "May 2026",
    tone: ["#E3D5BF", "#5A6642"],
    image: null,
    body: "Every piece starts on the sand. Here’s what a gathering morning looks like before anything reaches the bench.",
  },
  {
    slug: "a-short-break",
    title: "A short break",
    tag: "Note",
    dateline: "April 2026",
    tone: ["#3F4A2E", "#B79B75"],
    image: null,
    body: "We’re pausing new orders for a little while to restock. Back soon — thank you for waiting with us.",
  },
];

/** Database row -> the product shape every storefront component already expects. */
export function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    metals: row.metals || [],
    materials: row.materials || [],
    drop: row.drop_name || null,
    soldOut: row.sold_out || (row.stock ?? 0) <= 0,
    stock: row.stock ?? 0,
    charmReady: row.charm_ready,
    featured: row.featured,
    position: row.position,
    published: row.published,
    blurb: row.blurb || "",
    description: row.description || "",
    care: row.care || "",
    tone: row.tone?.length === 2 ? row.tone : ["#5A6642", "#B79B75"],
    image: row.image_url || null,
    gallery: row.gallery || [],
  };
}

export function mapPost(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    dateline: row.dateline,
    body: row.body,
    tone: row.tone?.length === 2 ? row.tone : ["#5A6642", "#B79B75"],
    image: row.image_url || null,
    position: row.position,
    published: row.published,
  };
}

/**
 * All editable copy, keyed by block. Falls back to the bundled defaults for
 * any block Supabase hasn't got a row for (or when Supabase isn't configured),
 * so the site is never blank.
 */
export async function getContent() {
  const supabase = getServerClient();
  const content = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) content[key] = { ...DEFAULT_CONTENT[key] };
  if (!supabase) return content;

  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error || !data) return content;

  for (const row of data) {
    if (row.key in content) content[row.key] = withDefaults(row.key, row.value);
  }
  return content;
}

/** Published catalog, ordered the way the admin arranged it. */
export async function getProducts({ includeUnpublished = false } = {}) {
  const supabase = getServerClient();
  if (!supabase) return FALLBACK_PRODUCTS.map((p) => ({ ...p, stock: p.soldOut ? 0 : 5, image: null }));

  let query = supabase.from("products").select("*").order("position").order("created_at");
  if (!includeUnpublished) query = query.eq("published", true);

  const { data, error } = await query;
  if (error || !data?.length) {
    return FALLBACK_PRODUCTS.map((p) => ({ ...p, stock: p.soldOut ? 0 : 5, image: null }));
  }
  return data.map(mapProduct);
}

export async function getProduct(slug) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getJournal({ includeUnpublished = false } = {}) {
  const supabase = getServerClient();
  if (!supabase) return FALLBACK_JOURNAL;

  let query = supabase.from("journal_posts").select("*").order("position").order("created_at");
  if (!includeUnpublished) query = query.eq("published", true);

  const { data, error } = await query;
  if (error || !data?.length) return FALLBACK_JOURNAL;
  return data.map(mapPost);
}

/** Orders are admin-only: RLS returns nothing to anonymous callers. */
export async function getOrders() {
  const supabase = getServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return error || !data ? [] : data;
}

export async function getAuditLog(limit = 40) {
  const supabase = getServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return error || !data ? [] : data;
}
