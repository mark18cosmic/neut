# Neut Operations Dashboard — Claude Working Guide

This file is the operating brief for Claude or any other coding agent working on this repository alongside Codex. Read it before making changes. The goal is to preserve the working Neut jewellery workflow, production data, authentication, and hosted deployment while allowing safe incremental improvements.

## 1. Project purpose

Neut Operations Dashboard is a dark, mobile-friendly internal business application for a jewellery store. It manages:

- incoming customer orders and payment status;
- production configuration and inventory consumption;
- dispatch batches and Telegram delivery notes;
- completed deliveries, returns, and delivery dates;
- jewellery inventory and reorder levels;
- invoices, receipts, sales reports, and analytics;
- social-media marketing campaigns and spend attribution;
- payroll, invoices, bills, expenses, accounts, audit logs, and MIRA GST reporting;
- staff authentication and role-based access.

Production URL: `https://neut-orders-dashboard.jailam360.chatgpt.site/`

This is an existing production application, not a starter project. Preserve existing behavior and data.

## 2. Technology and hosting

- React 19 and Next-compatible App Router code
- vinext and Vite
- Cloudflare Workers runtime
- Cloudflare D1, bound as `DB`
- Drizzle schema and SQL migrations
- OpenAI Sites hosting
- TypeScript
- Plain CSS in `app/globals.css`
- Node.js `>=22.13.0`
- `pnpm-lock.yaml` is authoritative; use pnpm and do not replace the package manager

Hosting metadata is in `.openai/hosting.json`. The existing Sites project must be reused. Never create a second site for this repository.

## 3. Repository map

| Path | Responsibility |
| --- | --- |
| `app/page.tsx` | Authenticated application entry |
| `app/login/page.tsx` | Staff login page |
| `app/dashboard.tsx` | Main operational UI and client-side workflow orchestration |
| `app/catalog.ts` | Jewellery collections, Thaana letters, materials, component codes, and production BOM builder |
| `app/invoice.tsx` | Order-linked invoice and receipt view |
| `app/analytics-workspace.tsx` | Sales, material, letter, inventory, campaign, Gantt, and guided analytics |
| `app/marketing-controls.tsx` | Campaign create/edit controls |
| `app/business.tsx` | Business and finance shell |
| `app/finance-workspace.tsx` | Payroll, documents, accounts, reports, and finance actions |
| `app/tax.tsx` | MIRA GST reporting UI |
| `app/api/**/route.ts` | Authenticated server APIs |
| `app/lib/dashboard-auth.ts` | Staff credentials, session handling, and permanent access rules |
| `app/api/audit.ts` | Actor resolution and audit logging |
| `db/schema.ts` | Drizzle representation of the D1 schema |
| `drizzle/` | Ordered production database migrations |
| `public/` | Neut logo and login imagery |
| `tests/rendered-html.test.mjs` | Repository-specific workflow smoke tests |
| `.openai/hosting.json` | Existing Sites project and D1 binding |

## 4. Non-negotiable business rules

### Order pricing

- Boki Thaana Necklace: MVR 650
- Charm Bracelet: MVR 650
- Hiyala Necklace: MVR 980
- Thaana Stamp Necklace: MVR 450
- GST defaults to 8%.
- Discount is applied before GST.
- Express charge is added after GST.
- Order total is: `(quantity × unit price − discount) + GST + express charge`.
- Prices autofill from the selected product but may be represented explicitly in saved records.
- Paid orders created manually enter `Production`; unpaid orders enter `New`.

### Order state machine

The server is authoritative. Do not add client-only stage shortcuts.

```text
New -> Accepted -> Production -> Ready -> Dispatched -> Completed
                                            |             
                                            +-> Returned -> Ready
```

Allowed server transitions are defined in `app/api/orders/route.ts`:

- `New` to `Accepted`
- `Accepted` to `Production`
- `Production` to `Ready`
- `Dispatched` to `Completed` or `Returned`
- `Returned` to `Ready`

Moving to Production confirms payment. Completion requires a delivery date. A return requires a reason. Requeued returned orders must lose the old batch assignment and return metadata.

### Production and inventory

Materials are `Gold`, `Silver`, and `Rose Gold` except where the catalog currently limits a collection.

- Boki Thaana Necklace requires one selected Thaana letter component and one Boki Thaana chain.
- Charm Bracelet requires one selected Thaana letter component and one charm bracelet chain.
- Hiyala Necklace requires one Hiyala pendant and one Hiyala chain.
- Thaana Stamp Necklace requires one Thaana Stamp pendant, one Thaana Stamp chain, and a chosen letter to punch. The letter is configuration metadata, not a third inventory component.

Before `Production -> Ready`, the server must:

1. build or validate the production configuration;
2. require exactly the collection’s two stock component codes;
3. verify both components exist;
4. verify sufficient quantity for the full order quantity;
5. deduct inventory atomically;
6. write `Used for #order` inventory-history rows;
7. update the order only after validation succeeds.

Never deduct inventory in client state only. Never deduct it a second time when a returned delivery is requeued.

`app/catalog.ts` is the canonical mapping of collections, Thaana letters, materials, component codes, and `buildProductionConfig()`. Keep UI options, API validation, and analytics aligned with it.

### Delivery types

Supported types:

- `Collection` = customer pickup from Neut; never send it to the Telegram delivery group
- `Boat` = `🚤 Boat`
- `HMP1` = `HMP1 - 🏠`
- `HMP2` = `HMP2 - 🏠`
- `MLE` = `MLE - 🏠`
- `Doorstep` remains only as a legacy label and is not accepted for new orders

Contact number is required for every order and must remain visible in all relevant operational views.

### Telegram dispatch format

Multiple ready orders are compiled into one numbered batch. Batch IDs use:

```text
NEUT-YYYYMMDD-NNN
```

The message must begin with the batch number and total order count. Every order block must follow this structure with spacing between records:

```text
ORDER: #2005

Delivery type: HMP2 - 🏠
Name: Aminath Rifa
Contact: 7992384
Address: Tower 3, Flat 8C
Road: Halaveli Magu
Details: Punch letter Raa
```

Do not remove the order number, contact, address, road, or details. Boat information belongs in `Details`. Dispatch must create `dispatch_batches` and `dispatch_batch_items` records, update the orders, and write an audit event only after Telegram accepts the message.

## 5. Authentication and authorization

- Dashboard login uses app-managed users and the `neut_session` HttpOnly cookie.
- Sessions last 12 hours.
- All operational APIs must call `requireDashboardSession()`.
- Business and finance writes must also enforce the module role on the server.
- Business roles are Administrator, Finance Manager, Accountant, Payroll Officer, and Viewer.
- Shaima (`User-1`) and Thihnaan (`User-2`) must always remain active dashboard Admins and Business & Finance Administrators.
- Do not expose password hashes, salts, session tokens, cookies, or credentials in UI, logs, documentation, commits, or chat.
- Do not replace secure password derivation with plaintext passwords.
- Any new state-changing API must write an appropriate audit-log event.

The site itself may be publicly reachable, but application data is protected by the staff login. Do not weaken server-side authentication because the outer Sites access mode is public.

## 6. Data and migration rules

- `db/schema.ts` and the SQL migrations must describe the same durable entities.
- Existing migrations are immutable history. Add a new numbered migration for schema changes.
- Current latest migration is `0012_marketing_campaigns.sql`; the next migration should be `0013_<descriptive_name>.sql`.
- Prefer additive, backwards-compatible D1 changes.
- Use parameterized D1 statements. Never interpolate user input into SQL.
- Keep API response aliases in camelCase even when SQLite columns use snake_case.
- Boolean values are stored as integers and converted at the API boundary.
- Dates use ISO `YYYY-MM-DD`; timestamps use ISO strings.
- Do not delete production or demo data unless the user explicitly requests it and the exact scope is confirmed.

Main durable tables include orders, inventory, inventory history, dashboard users and sessions, dispatch batches and items, business users, audit log, tax settings and filings, payroll entities, finance documents, ledger entries, and marketing campaigns.

## 7. UI and accessibility rules

- Dark mode is the only supported visual theme.
- Preserve the readable font sizing added across the dashboard.
- Maintain the grouped navigation: Orders, Inventory, and Finance & insights.
- Relevant pages need pending/current and completed/history views.
- All list/history views should retain date-from, date-to, and search controls where applicable.
- Tables should be compact on desktop and horizontally scroll inside their panel on mobile; they must never widen the page itself.
- At widths below 760px, dropdown navigation must stay within the viewport.
- Buttons and icons must remain touch-friendly and clearly labelled.
- Do not replace functional controls with decorative mockups.
- Preserve keyboard focus behavior, form labels, error messages, and empty states.
- Every invoice icon must continue opening the invoice linked to that exact order number.

## 8. Analytics and reporting rules

- Sales analytics must use actual order, inventory, history, and campaign data returned by the APIs.
- Preserve date and search filters across analytics and exports.
- Letter analytics must answer questions such as “How many Alifu have been sold?” using production configuration, not a guessed product label.
- Material analytics must use recorded production material.
- Marketing ROAS is attributed revenue divided by spend; handle zero spend safely.
- Campaign data is currently manually entered. Do not imply a live Instagram or TikTok API connection unless one is actually implemented and authorized.
- MIRA reports are operational aids and must not be represented as automatically filed with the government.
- CSV exports must escape quotes and preserve order/customer/contact/payment/GST fields.

## 9. Secrets and external services

Expected runtime variables:

- `TELEGRAM_BOT_TOKEN` — secret
- `TELEGRAM_CHAT_ID` — configuration value
- inventory edit password if configured by the application/runtime

Rules:

- Never read, print, paste, commit, or document values from `.env.local`.
- Never place a Telegram token in source code, a Git remote, a URL, a screenshot, or an error message.
- Keep `.env*` ignored.
- Hosted variables are managed through Sites, not by uploading `.env.local`.
- Treat any token pasted into chat as exposed and recommend rotating it.
- Do not send Telegram messages, publish deployments, alter access policy, or modify hosted secrets without explicit user approval for that action.

## 10. Local development and validation

Install only if dependencies are absent:

```bash
pnpm install --frozen-lockfile
```

Common commands:

```bash
pnpm dev
pnpm build
node --test tests/rendered-html.test.mjs
pnpm lint
pnpm db:generate
```

Required validation for normal application changes:

1. run the production build;
2. run the repository smoke tests;
3. run `git diff --check`;
4. inspect the affected workflow at desktop width;
5. if layout or navigation changed, test at approximately 390 × 844 and confirm `document.documentElement.scrollWidth <= window.innerWidth`;
6. verify no browser console errors or warnings caused by the change;
7. verify unauthorized API requests still fail.

For schema changes, also inspect the generated migration and test both an existing database path and a fresh database path.

## 11. Working alongside Codex

Claude and Codex must not make overlapping edits in the same working tree at the same time.

Before every task:

```bash
git status --short --branch
git log -6 --oneline
```

Collaboration protocol:

1. Read this file and inspect the current diff before editing.
2. Treat every pre-existing modified or untracked file as someone else’s work unless explicitly assigned.
3. Never clean, reset, delete, move, or overwrite another agent’s work.
4. Prefer a separate Git worktree and a `claude/<task-name>` branch when Claude and Codex will work simultaneously.
5. If using the same working tree, divide ownership by file and do not touch files currently owned by the other agent.
6. Make small, focused changes and commits. Do not bundle unrelated cleanup.
7. Re-read `git diff` immediately before and after each edit because another agent may have changed the tree.
8. Do not rewrite, squash, amend, rebase, force-push, or reset commits created by the other agent.
9. Before handoff, report the exact files changed, validation performed, commit SHA, remaining risks, and whether anything was published.
10. Publishing requires an explicit user instruction even when code is ready.

Recommended simultaneous-work setup from the parent directory:

```bash
git -C "neut orders dashboard" worktree add "neut-orders-claude" -b claude/<task-name>
```

Claude should work inside the new `neut-orders-claude` directory. Codex can remain in the original directory. Merge only after both sides have completed validation and reviewed each other’s diff.

## 12. Change checklist

Before considering work complete, confirm:

- the requested workflow works end to end, not just visually;
- server-side validation matches the UI;
- all writes require a valid dashboard session;
- role restrictions are enforced by the API;
- inventory cannot go negative;
- paid/unpaid, GST, discount, express charge, contact, and invoice linkage are preserved;
- dispatch batches remain traceable;
- return and redelivery paths preserve audit history;
- mobile layouts do not create page-level horizontal overflow;
- new schema has an ordered migration;
- tests cover the important regression;
- no secrets or personal credentials appear in the diff;
- no unrelated user files or build archives were changed;
- the user is told clearly whether the result is local, saved, or live.

## 13. Definition of done

A change is done only when it is implemented in the appropriate client and server layers, validated in proportion to risk, documented where necessary, and handed off without disturbing concurrent work. A successful local build is not the same as a published deployment. A saved Sites version is not the same as a live deployment. Never claim a release is live until the production deployment status explicitly succeeds.
