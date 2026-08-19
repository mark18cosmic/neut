# Neut — Claude Working Guide

Operating brief for Claude or any other coding agent working in this repository.
Read it before making changes.

## 1. What this is

Neut is a Maldivian jewellery brand's storefront plus a small admin panel that
the owners run the shop from. Public side: home, shop and category pages,
product pages, charm builder, cart and checkout, journal, about. Admin side
(`/admin`): products, orders, journal posts, and editable site content.

There is no separate CMS and no payment gateway — checkout records an order and
the customer transfers, then the admin moves the order through its statuses.

## 2. Stack

- Next.js 14 App Router, React 18, JavaScript (no TypeScript)
- Tailwind CSS, plus a few hand-written utilities in `app/globals.css`
- Supabase — Postgres, Auth, Storage — via `@supabase/ssr`
- npm; `package-lock.json` is authoritative
- Node 22 (`node:22-alpine` in the image)
- Docker / OrbStack for local hosting: `docker compose up --build`

Environment (`.env.local`, and `.env` for compose — both gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Both are publishable values. The service role key and the database password are
never used by this app and must never be added to it. `NEXT_PUBLIC_*` values are
baked into the client bundle at **build** time, so the Docker image takes them
as build args as well as runtime env.

## 3. Repository map

| Path | Responsibility |
| --- | --- |
| `app/page.js` | Home |
| `app/shop/page.js`, `app/shop/[category]/page.js` | Shop and category listings |
| `app/product/[slug]/page.js` | Product detail |
| `app/builder/page.js` | Charm builder route (renders `components/BuilderView.js`) |
| `app/cart/page.js` | Cart and checkout (renders `components/CartView.js`) |
| `app/journal/page.js`, `app/about/page.js` | Journal and about |
| `app/admin/**` | Admin pages: dashboard, products, orders, journal, content, login |
| `app/admin/actions.js` | Admin server actions — every admin write goes through here |
| `app/actions/orders.js` | `placeOrder()` — the public checkout write |
| `components/admin/**` | Admin UI (managers, editors, shell, shared `ui.js` primitives) |
| `lib/data.js` | Reads storefront data from Supabase, with bundled fallbacks |
| `lib/site.js` | Default site content blocks and their shapes |
| `lib/supabase/client.js` | Browser client (`createClient`) |
| `lib/supabase/server.js` | Server client, `requireAdmin()`, `audit()` |
| `middleware.js` | Refreshes the auth cookie, redirects `/admin` when logged out |
| `supabase/schema.sql` | Full schema, RLS policies, storage policies — run once |
| `supabase/seed.sql` | Starter products, posts, and content blocks |
| `Dockerfile`, `docker-compose.yml` | OrbStack/Docker image and service |

## 4. Data model

Tables in `public`: `admins`, `site_content`, `products`, `journal_posts`,
`orders`, `audit_log`. Storage bucket: `media`.

- `admins` is the allowlist. A Supabase Auth user is an admin **only** if their
  id is in this table — creating an auth user grants nothing on its own. Roles
  are `owner` and `editor`.
- `site_content` is one row per editable block, `value` as `jsonb`, so a block
  can gain fields without a migration. Shapes live in `lib/site.js`.
- `products.price` is whole MVR. `tone` is a two-colour gradient pair used
  throughout the UI. `position` orders listings.
- `orders.items` is denormalised JSON so an order stays readable after a
  product is renamed or deleted. `reference` is `NE-1042` style from
  `next_order_reference()`.
- Order statuses: `awaiting_transfer -> paid -> packing -> delivered`, and
  `cancelled` from any point. Do not invent statuses the check constraint
  rejects.
- `audit_log` records who changed what.

Schema rules:

- `supabase/schema.sql` is the single source of truth and is written to be
  re-runnable (`if not exists`, `drop policy if exists`). Change it there, then
  re-run it — do not hand-edit the database only.
- Every table has RLS on. Public traffic gets read-only access to published
  content and insert-only access to `orders`. All other writes require
  `is_admin()`.
- Timestamps are `timestamptz`; the API surface stays camelCase even though
  columns are snake_case (`lib/data.js` does the mapping).
- Never delete production data unless the user asks and the scope is confirmed.

## 5. Authorization rules

- `middleware.js` redirecting `/admin` is **convenience only**. It is not the
  security boundary.
- Every admin server action must call `requireAdmin()` before touching data,
  and every state-changing action must call `audit(...)` after it succeeds.
- RLS in Postgres is the last line of defence and must stay enabled. Never work
  around a policy by reaching for the service role key.
- Never expose tokens, session cookies, or keys in UI, logs, commits, or chat.

## 6. UI rules

- The palette (olive, cream, sand, clay) and the serif/wordmark type are the
  brand — do not swap them out casually.
- Prices always render through `components/Price.js` so currency stays
  consistent.
- Mobile first: tables and wide panels scroll inside their own container and
  must never make the page itself scroll sideways.
- Keep controls functional — no decorative mockups standing in for real ones.
- Preserve focus behaviour, form labels, error messages, and empty states.
- The charm builder's preview charms are draggable along the chain, with arrow
  keys as the keyboard equivalent. Keep both paths working.

## 7. Local development

```bash
npm install
npm run dev                     # http://localhost:3000
docker compose up --build -d    # http://localhost:3000, http://neut.orb.local
```

First-time Supabase setup: run `supabase/schema.sql` then `supabase/seed.sql`
in the project's SQL editor, create an auth user, and insert their id into
`public.admins`.

Before considering a change done:

1. `npm run build` passes (the Docker build runs it too);
2. the affected flow works in the browser, not just visually;
3. admin writes still fail when logged out;
4. no page-level horizontal overflow at ~390x844;
5. `git diff --check` is clean and no secrets are in the diff;
6. the user is told plainly whether the result is local, committed, or live.

## 8. Working alongside other agents

If another agent (Codex) is active in the same tree: read `git status --short`
first, treat pre-existing modified or untracked files as someone else's work,
never reset or overwrite them, and prefer a separate worktree and branch. Make
small focused commits. Publishing or pushing needs an explicit instruction.
