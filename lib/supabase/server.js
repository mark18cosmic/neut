import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when the project has been pointed at a Supabase instance. */
export const supabaseConfigured = Boolean(URL && ANON);

/**
 * Server-side Supabase client bound to the request cookies.
 *
 * Returns null when the project has no Supabase credentials, so every caller
 * can fall back to the bundled defaults and the site still renders. Never
 * throws during a page render.
 */
export function getServerClient() {
  if (!supabaseConfigured) return null;

  const store = cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      get: (name) => store.get(name)?.value,
      set: (name, value, options) => {
        // Called from Server Components during render, where cookies are
        // read-only. Session refresh is handled in middleware.js instead.
        try {
          store.set({ name, value, ...options });
        } catch {}
      },
      remove: (name, options) => {
        try {
          store.set({ name, value: "", ...options });
        } catch {}
      },
    },
  });
}

/**
 * The signed-in admin, or null. An auth user is only an admin when a matching
 * row exists in public.admins — creating an auth user alone grants nothing.
 */
export async function getAdmin() {
  const supabase = getServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("id, email, name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) return null;
  return { ...admin, email: admin.email || user.email };
}

/** Throws unless the caller is an admin. Use at the top of every write action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Not authorised — sign in to the Neut studio first.");
  return admin;
}

/** Record an admin write. Failures here never block the write itself. */
export async function audit(action, entity, entityId, detail = {}) {
  const supabase = getServerClient();
  if (!supabase) return;
  const admin = await getAdmin();
  try {
    await supabase.from("audit_log").insert({
      actor_id: admin?.id ?? null,
      actor_email: admin?.email ?? null,
      action,
      entity,
      entity_id: entityId ? String(entityId) : null,
      detail,
    });
  } catch {}
}
