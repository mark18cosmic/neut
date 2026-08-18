"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import { Badge, Button, Field, ImageField, Modal, Toast, Toggle, ToneField, inputClass } from "./ui";
import { CATEGORIES, MATERIALS, METALS, currency } from "@/lib/products";
import { deleteProduct, patchProduct, saveProduct } from "@/app/admin/actions";

const BLANK = {
  id: null,
  slug: "",
  name: "",
  category: "necklaces",
  price: 500,
  stock: 5,
  metals: ["gold", "silver"],
  materials: [],
  drop: "",
  soldOut: false,
  charmReady: false,
  featured: true,
  published: true,
  position: 0,
  blurb: "",
  description: "",
  care: "",
  tone: ["#5A6642", "#B79B75"],
  image: null,
  gallery: [],
};

export default function ProductManager({ initial }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [pending, setPending] = useState(null);
  const [toast, setToast] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initial.filter((p) => {
      if (filter === "live" && (!p.published || p.soldOut)) return false;
      if (filter === "sold" && !p.soldOut) return false;
      if (filter === "hidden" && p.published) return false;
      if (filter !== "all" && filter !== "live" && filter !== "sold" && filter !== "hidden") {
        if (p.category !== filter) return false;
      }
      if (!q) return true;
      return `${p.name} ${p.slug} ${p.drop || ""} ${p.blurb}`.toLowerCase().includes(q);
    });
  }, [initial, query, filter]);

  async function run(fn, successMessage) {
    const result = await fn();
    setPending(null);
    if (result?.ok) {
      setToast({ message: successMessage, tone: "ok" });
      router.refresh();
    } else {
      setToast({ message: result?.error || "Something went wrong.", tone: "error" });
    }
    return result;
  }

  async function inlinePatch(id, patch, message) {
    setPending(id);
    await run(() => patchProduct(id, patch), message);
  }

  const filters = [
    { key: "all", label: "All" },
    { key: "live", label: "Live" },
    { key: "sold", label: "Sold out" },
    { key: "hidden", label: "Hidden" },
    ...CATEGORIES.map((c) => ({ key: c.slug, label: c.label })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Studio"
        title="Products"
        subtitle="The catalog behind the shop, the charm builder and every product page."
        actions={<Button onClick={() => setEditing({ ...BLANK })}>+ New piece</Button>}
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 border-y border-olive/10 py-4 md:flex-row md:items-center md:justify-between">
        <div className="scroll-x flex gap-2 pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition duration-300 ${
                filter === f.key ? "bg-olive text-cream" : "bg-cream text-olive/65 hover:bg-sand/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pieces…"
          className={`${inputClass} md:w-64`}
        />
      </div>

      {results.length === 0 ? (
        <p className="py-20 text-center font-serif text-2xl text-olive/45">
          Nothing matches — try another filter.
        </p>
      ) : (
        <div className="scroll-x rounded-xl border border-olive/10 bg-cream/70">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-olive/40">
                <th className="px-4 py-3 font-normal">Piece</th>
                <th className="px-3 py-3 font-normal">Category</th>
                <th className="px-3 py-3 font-normal">Price</th>
                <th className="px-3 py-3 font-normal">Stock</th>
                <th className="px-3 py-3 font-normal">Drop</th>
                <th className="px-3 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive/10">
              {results.map((p) => (
                <tr
                  key={p.id || p.slug}
                  className={`transition duration-300 hover:bg-ivory/70 ${
                    pending === p.id ? "opacity-55" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-10 w-10 shrink-0 rounded bg-cover bg-center"
                        style={
                          p.image
                            ? { backgroundImage: `url(${p.image})` }
                            : { background: `linear-gradient(135deg, ${p.tone[1]}, ${p.tone[0]})` }
                        }
                      />
                      <span className="min-w-0">
                        <span className="block font-serif text-base text-olive-deep">{p.name}</span>
                        <span className="block text-xs text-olive/40">/{p.slug}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 capitalize text-olive/65">{p.category}</td>
                  <td className="px-3 py-3 text-olive/65">{currency(p.price)}</td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min={0}
                      defaultValue={p.stock}
                      onBlur={(e) => {
                        const next = Number(e.target.value);
                        if (next !== p.stock) inlinePatch(p.id, { stock: next }, "Stock updated.");
                      }}
                      className="w-16 rounded border border-olive/20 bg-ivory px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      defaultValue={p.drop || ""}
                      placeholder="—"
                      onBlur={(e) => {
                        const next = e.target.value.trim();
                        if (next !== (p.drop || "")) inlinePatch(p.id, { drop: next }, "Drop updated.");
                      }}
                      className="w-28 rounded border border-olive/20 bg-ivory px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() =>
                          inlinePatch(
                            p.id,
                            { soldOut: !p.soldOut },
                            p.soldOut ? "Back on sale." : "Marked sold out."
                          )
                        }
                        className="transition hover:opacity-75"
                      >
                        <Badge tone={p.soldOut ? "clay" : "olive"}>
                          {p.soldOut ? "Sold out" : "Available"}
                        </Badge>
                      </button>
                      {!p.published && <Badge tone="muted">Hidden</Badge>}
                      {p.featured && <Badge tone="sand">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing({ ...p, drop: p.drop || "" })}
                      className="link-grow text-xs text-olive/60"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ProductForm
          value={editing}
          onClose={() => setEditing(null)}
          onDelete={() => setConfirming(editing)}
          onSave={async (draft) => {
            const result = await run(() => saveProduct(draft), "Piece saved.");
            if (result?.ok) setEditing(null);
          }}
        />
      )}

      {confirming && (
        <Modal
          title={`Delete ${confirming.name}?`}
          onClose={() => setConfirming(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirming(null)}>
                Keep it
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  const target = confirming;
                  setConfirming(null);
                  const result = await run(() => deleteProduct(target.id), "Piece deleted.");
                  if (result?.ok) setEditing(null);
                }}
              >
                Delete permanently
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-olive/70">
            This removes the piece from the shop, the builder and every filter. Past orders keep
            their own copy of the name and price, so order history stays readable. If you only want
            it off the shop for now, close this and untick <em>Show in the shop</em> instead.
          </p>
        </Modal>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
}

function ProductForm({ value, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const toggleIn = (key, item) =>
    set({
      [key]: draft[key].includes(item)
        ? draft[key].filter((x) => x !== item)
        : [...draft[key], item],
    });

  return (
    <Modal
      title={draft.id ? `Edit ${value.name}` : "New piece"}
      onClose={onClose}
      footer={
        <>
          {draft.id && (
            <Button variant="danger" onClick={onDelete} className="mr-auto">
              Delete
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            busy={busy}
            onClick={async () => {
              setBusy(true);
              await onSave(draft);
              setBusy(false);
            }}
          >
            Save piece
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Photo" hint="Shown on the card, the product page and the cart.">
          <ImageField value={draft.image} onChange={(image) => set({ image })} folder="products" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input value={draft.name} onChange={(e) => set({ name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Web address (slug)" hint="Leave blank to build it from the name.">
            <input
              value={draft.slug}
              onChange={(e) => set({ slug: e.target.value })}
              placeholder="tide-locket"
              className={inputClass}
            />
          </Field>
          <Field label="Price (MVR)">
            <input
              type="number"
              min={0}
              value={draft.price}
              onChange={(e) => set({ price: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              min={0}
              value={draft.stock}
              onChange={(e) => set({ stock: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) => set({ category: e.target.value })}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Drop name" hint="Fills the Latest Drop rail on the home page.">
            <input
              value={draft.drop}
              onChange={(e) => set({ drop: e.target.value })}
              placeholder="Low Tide"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Finishes">
          <div className="flex gap-2">
            {METALS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleIn("metals", m)}
                className={`rounded-full border px-4 py-1.5 text-sm capitalize transition duration-300 ${
                  draft.metals.includes(m)
                    ? "border-olive bg-olive text-cream"
                    : "border-olive/25 text-olive/60 hover:border-olive/50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Materials" hint="Used by the shop filters.">
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleIn("materials", m)}
                className={`rounded-full border px-3 py-1 text-xs capitalize transition duration-300 ${
                  draft.materials.includes(m)
                    ? "border-olive bg-olive text-cream"
                    : "border-olive/20 text-olive/55 hover:border-olive/50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Blurb" hint="One line under the name on the card.">
          <input value={draft.blurb} onChange={(e) => set({ blurb: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea
            rows={3}
            value={draft.description}
            onChange={(e) => set({ description: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Care notes">
          <textarea
            rows={2}
            value={draft.care}
            onChange={(e) => set({ care: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="Fallback wash" hint="Used anywhere this piece has no photo yet.">
          <ToneField value={draft.tone} onChange={(tone) => set({ tone })} />
        </Field>

        <div className="grid gap-3 rounded-lg bg-cream/60 p-4 sm:grid-cols-2">
          <Toggle checked={draft.published} onChange={(published) => set({ published })} label="Show in the shop" />
          <Toggle checked={draft.featured} onChange={(featured) => set({ featured })} label="Feature on the home page" />
          <Toggle
            checked={draft.charmReady}
            onChange={(charmReady) => set({ charmReady })}
            label="Can hold charms (charm builder)"
          />
          <Toggle checked={draft.soldOut} onChange={(soldOut) => set({ soldOut })} label="Mark sold out" />
        </div>

        <Field label="Sort order" hint="Lower numbers come first across the shop.">
          <input
            type="number"
            value={draft.position}
            onChange={(e) => set({ position: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>
    </Modal>
  );
}
