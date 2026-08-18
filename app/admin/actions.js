"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient, requireAdmin, audit } from "@/lib/supabase/server";
import { CONTENT_BLOCKS, DEFAULT_CONTENT, withDefaults } from "@/lib/site";

/**
 * Every action here follows the same shape:
 *   1. requireAdmin()  — server-side authorisation, never trusted from the UI
 *   2. validate        — the client is not the authority on anything
 *   3. write           — RLS enforces the same rule again in Postgres
 *   4. audit + revalidate
 */

function ok(data = {}) {
  return { ok: true, ...data };
}
function fail(error) {
  return { ok: false, error };
}

/** Refresh every storefront surface that can show admin-managed content. */
function revalidateStorefront() {
  for (const path of ["/", "/shop", "/journal", "/about", "/cart", "/builder"]) {
    revalidatePath(path);
  }
  revalidatePath("/shop/[category]", "page");
  revalidatePath("/product/[slug]", "page");
}

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// ---------------------------------------------------------------------------
// Site content
// ---------------------------------------------------------------------------
export async function saveContentBlock(key, value) {
  try {
    const admin = await requireAdmin();
    const block = CONTENT_BLOCKS.find((b) => b.key === key);
    if (!block) return fail("Unknown content block.");

    const supabase = getServerClient();
    // Keep only fields the schema declares, so a stray form value can't be
    // written into the document.
    const allowed = new Set(block.fields.map((f) => f.key));
    const clean = {};
    for (const [k, v] of Object.entries(value || {})) {
      if (allowed.has(k)) clean[k] = v;
    }

    const { error } = await supabase
      .from("site_content")
      .upsert(
        { key, value: withDefaults(key, clean), updated_at: new Date().toISOString(), updated_by: admin.id },
        { onConflict: "key" }
      );
    if (error) return fail(error.message);

    await audit("content.update", "site_content", key, { fields: Object.keys(clean) });
    revalidateStorefront();
    revalidatePath("/admin/content");
    return ok();
  } catch (e) {
    return fail(e.message);
  }
}

export async function resetContentBlock(key) {
  try {
    await requireAdmin();
    if (!DEFAULT_CONTENT[key]) return fail("Unknown content block.");

    const supabase = getServerClient();
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value: DEFAULT_CONTENT[key], updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return fail(error.message);

    await audit("content.reset", "site_content", key);
    revalidateStorefront();
    revalidatePath("/admin/content");
    return ok({ value: DEFAULT_CONTENT[key] });
  } catch (e) {
    return fail(e.message);
  }
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
const CATEGORY_SET = new Set(["necklaces", "bracelets", "charms"]);

function normaliseProduct(input) {
  const price = Math.round(Number(input.price));
  const stock = Math.round(Number(input.stock));

  if (!String(input.name || "").trim()) throw new Error("A piece needs a name.");
  if (!CATEGORY_SET.has(input.category)) throw new Error("Pick a valid category.");
  if (!Number.isFinite(price) || price < 0) throw new Error("Price must be zero or more.");
  if (!Number.isFinite(stock) || stock < 0) throw new Error("Stock cannot be negative.");

  const metals = (input.metals || []).filter((m) => ["gold", "silver"].includes(m));
  if (metals.length === 0) throw new Error("Choose at least one finish.");

  return {
    slug: slugify(input.slug || input.name),
    name: String(input.name).trim(),
    category: input.category,
    price,
    stock,
    metals,
    materials: (input.materials || []).map(String),
    drop_name: String(input.drop || "").trim() || null,
    // A piece with no stock reads as sold out everywhere, so the two can't disagree.
    sold_out: Boolean(input.soldOut) || stock <= 0,
    charm_ready: Boolean(input.charmReady),
    featured: Boolean(input.featured),
    published: Boolean(input.published),
    position: Number.isFinite(Number(input.position)) ? Number(input.position) : 0,
    blurb: String(input.blurb || ""),
    description: String(input.description || ""),
    care: String(input.care || ""),
    tone: Array.isArray(input.tone) && input.tone.length === 2 ? input.tone : ["#5A6642", "#B79B75"],
    image_url: input.image || null,
    gallery: (input.gallery || []).filter(Boolean),
  };
}

export async function saveProduct(input) {
  try {
    await requireAdmin();
    const supabase = getServerClient();
    const row = normaliseProduct(input);

    if (input.id) {
      const { error } = await supabase.from("products").update(row).eq("id", input.id);
      if (error) return fail(error.message);
      await audit("product.update", "products", input.id, { slug: row.slug });
    } else {
      const { data, error } = await supabase.from("products").insert(row).select("id").single();
      if (error) {
        return fail(
          error.code === "23505" ? "Another piece already uses that web address (slug)." : error.message
        );
      }
      await audit("product.create", "products", data.id, { slug: row.slug });
    }

    revalidateStorefront();
    revalidatePath("/admin/products");
    return ok();
  } catch (e) {
    return fail(e.message);
  }
}

/** Small inline edits from the table — stock, sold out, published, featured. */
export async function patchProduct(id, patch) {
  try {
    await requireAdmin();
    const supabase = getServerClient();

    const clean = {};
    if ("stock" in patch) {
      const stock = Math.round(Number(patch.stock));
      if (!Number.isFinite(stock) || stock < 0) return fail("Stock cannot be negative.");
      clean.stock = stock;
      if (stock <= 0) clean.sold_out = true;
    }
    if ("soldOut" in patch) clean.sold_out = Boolean(patch.soldOut);
    if ("published" in patch) clean.published = Boolean(patch.published);
    if ("featured" in patch) clean.featured = Boolean(patch.featured);
    if ("position" in patch) clean.position = Number(patch.position) || 0;
    if ("drop" in patch) clean.drop_name = String(patch.drop || "").trim() || null;

    // Marking something available again needs stock behind it.
    if (clean.sold_out === false) {
      const { data: current } = await supabase.from("products").select("stock").eq("id", id).single();
      const stock = "stock" in clean ? clean.stock : current?.stock ?? 0;
      if (stock <= 0) return fail("Add stock before putting this piece back on sale.");
    }

    if (Object.keys(clean).length === 0) return ok();

    const { error } = await supabase.from("products").update(clean).eq("id", id);
    if (error) return fail(error.message);

    await audit("product.patch", "products", id, clean);
    revalidateStorefront();
    revalidatePath("/admin/products");
    return ok();
  } catch (e) {
    return fail(e.message);
  }
}

export async function deleteProduct(id) {
  try {
    await requireAdmin();
    const supabase = getServerClient();
    const { data: row } = await supabase.from("products").select("slug").eq("id", id).single();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return fail(error.message);

    await audit("product.delete", "products", id, { slug: row?.slug });
    revalidateStorefront();
    revalidatePath("/admin/products");
    return ok();
  } catch (e) {
    return fail(e.message);
  }
}

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------
export async function savePost(input) {
  try {
    await requireAdmin();
    const supabase = getServerClient();

    if (!String(input.title || "").trim()) return fail("A post needs a title.");

    const row = {
      slug: slugify(input.slug || input.title),
      title: String(input.title).trim(),
      tag: String(input.tag || "Note").trim(),
      dateline: String(input.dateline || "").trim(),
      body: String(input.body || ""),
      tone: Array.isArray(input.tone) && input.tone.length === 2 ? input.tone : ["#5A6642", "#B79B75"],
      image_url: input.image || null,
      position: Number(input.position) || 0,
      published: Boolean(input.published),
    };

    if (input.id) {
      const { error } = await supabase.from("journal_posts").update(row).eq("id", input.id);
      if (error) return fail(error.message);
      await audit("post.update", "journal_posts", input.id, { slug: row.slug });
    } else {
      const { data, error } = await supabase.from("journal_posts").insert(row).select("id").single();
      if (error) {
        return fail(error.code === "23505" ? "Another post already uses that slug." : error.message);
      }
      await audit("post.create", "journal_posts", data.id, { slug: row.slug });
    }

    revalidatePath("/journal");
    revalidatePath("/admin/journal");
    return ok();
  } catch (e) {
    return fail(e.message);
  }
}

export async function deletePost(id) {
  try {
    await requireAdmin();
    const supabase = getServerClient();
    const { error } = await supabase.from("journal_posts").delete().eq("id", id);
    if (error) return fail(error.message);

    await audit("post.delete", "journal_posts", id);
    revalidatePath("/journal");
    revalidatePath("/admin/journal");
    return ok();
  } catch (e) {
    return fail(e.message);
  }
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
const ORDER_STATUSES = ["awaiting_transfer", "paid", "packing", "delivered", "cancelled"];

export async function setOrderStatus(id, status) {
  try {
    await requireAdmin();
    if (!ORDER_STATUSES.includes(status)) return fail("Unknown order status.");

    const supabase = getServerClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return fail(error.message);

    await audit("order.status", "orders", id, { status });
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return ok();
  } catch (e) {
    return fail(e.message);
  }
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------
export async function signOut() {
  const supabase = getServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
