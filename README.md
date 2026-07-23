# Neut

Boutique e-commerce storefront for **Neut** — a Maldivian handmade jewelry brand (charms, bracelets, necklaces) based in Malé. _Created by us, curated for you._

Built with **Next.js (App Router)** + **Tailwind CSS**.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, latest drop rail, full-width photo break, featured grid |
| `/shop` | All products with category + metal + material filters |
| `/shop/[category]` | Necklaces / Bracelets / Charms |
| `/product/[slug]` | Detail page: lifestyle photos, MVR/USD price, finish, "add a charm" upsell, care notes |
| `/builder` | Charm builder — pick a chain + layer up to 5 charms with live preview |
| `/cart` | Cart + checkout (name, Instagram, island) → order confirmed via DM, paid by bank transfer |
| `/about` | Brand story, photography-led |
| `/journal` | Drops & behind-the-scenes feed |
| `/admin` | Manage products, stock, sold-out, drop tags; sample order list |

## Design system

- **Palette:** deep olive `#3F4A2E`, cream `#F3EDE2`, sand `#E3D5BF`, clay `#B79B75`, near-black chrome `#171712`
- **Type:** Cormorant Garamond (display/wordmark) + Jost (UI). Set in `app/layout.js`.
- **Logo:** circular olive badge with cream "neut" ligature wordmark + sparkle — `components/Logo.js`
- **Imagery:** `components/Photo.js` renders warm gradient lifestyle placeholders (driftwood/sand/shell tones). **Swap this for `next/image` with real photography** when assets are ready — each product carries a `tone` pair in `lib/products.js`.

## Notes / next steps

- **Catalog** lives in `lib/products.js`. Wire the admin panel + a real DB/CMS (e.g. Sanity, or a Postgres + API routes) to make edits persistent — currently the admin is a localStorage prototype.
- **Checkout** captures the order and instructs bank transfer + Instagram DM confirmation (per brand). No card gateway wired.
- **Currency** MVR/USD toggle uses a fixed display rate in `lib/products.js` (`USD_RATE`).
- Cart + currency persist in `localStorage` via `components/store.js`.
- Deploys cleanly to **Vercel** (`vercel` / connect the repo).
