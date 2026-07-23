"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, currency } from "@/lib/products";

const STORE_KEY = "neut-admin-products";

export default function AdminPage() {
  const [tab, setTab] = useState("products");
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      setItems(saved || PRODUCTS);
    } catch {
      setItems(PRODUCTS);
    }
  }, []);

  function persist(next) {
    setItems(next);
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  }

  function update(slug, patch) {
    persist(items.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  }

  function saveEdit() {
    update(editing.slug, editing);
    setEditing(null);
  }

  function addProduct() {
    const slug = `new-piece-${Date.now().toString().slice(-4)}`;
    const p = {
      slug,
      name: "New Piece",
      category: "necklaces",
      price: 500,
      metals: ["gold", "silver"],
      materials: ["engraved"],
      drop: null,
      soldOut: false,
      tone: ["#5A6642", "#B79B75"],
      blurb: "A new arrival.",
      description: "Add a description.",
      care: "Add care notes.",
      charmReady: false,
      stock: 5,
    };
    persist([p, ...items]);
    setEditing(p);
  }

  function resetAll() {
    localStorage.removeItem(STORE_KEY);
    setItems(PRODUCTS);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow text-clay">Admin</p>
          <h1 className="wordmark text-4xl text-olive-deep">Studio</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={addProduct} className="rounded-full bg-olive px-5 py-2 text-sm text-cream">+ New product</button>
          <button onClick={resetAll} className="rounded-full border border-olive/25 px-5 py-2 text-sm text-olive/70">Reset demo</button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-olive/10">
        {["products", "drops", "orders"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize ${
              tab === t ? "border-b-2 border-olive font-medium text-olive-deep" : "text-olive/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-olive/40">
                <th className="py-2 font-normal">Piece</th>
                <th className="py-2 font-normal">Category</th>
                <th className="py-2 font-normal">Price</th>
                <th className="py-2 font-normal">Stock</th>
                <th className="py-2 font-normal">Status</th>
                <th className="py-2 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive/10">
              {items.map((p) => (
                <tr key={p.slug}>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded" style={{ background: `linear-gradient(135deg, ${p.tone[1]}, ${p.tone[0]})` }} />
                      <span className="font-serif text-base text-olive-deep">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-olive/70">{p.category}</td>
                  <td className="py-3 text-olive/70">{currency(p.price)}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={p.stock ?? 0}
                      onChange={(e) => update(p.slug, { stock: Number(e.target.value) })}
                      className="w-16 rounded border border-olive/20 bg-ivory px-2 py-1"
                    />
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => update(p.slug, { soldOut: !p.soldOut })}
                      className={`rounded-full px-3 py-1 text-xs ${
                        p.soldOut ? "bg-clay/30 text-olive-deep" : "bg-olive/10 text-olive"
                      }`}
                    >
                      {p.soldOut ? "Sold out" : "Available"}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => setEditing(p)} className="text-xs text-olive/60 underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "drops" && (
        <div className="space-y-3">
          <p className="text-sm text-olive/60">Tag a piece into the current drop so it appears in the Latest Drop rail.</p>
          {items.map((p) => (
            <div key={p.slug} className="flex items-center justify-between rounded-lg border border-olive/10 px-4 py-3">
              <span className="font-serif text-lg text-olive-deep">{p.name}</span>
              <input
                value={p.drop || ""}
                placeholder="Drop name (e.g. Low Tide)"
                onChange={(e) => update(p.slug, { drop: e.target.value || null })}
                className="w-56 rounded border border-olive/20 bg-ivory px-3 py-1.5 text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && <Orders />}

      {editing && (
        <EditModal editing={editing} setEditing={setEditing} save={saveEdit} />
      )}
    </div>
  );
}

function Orders() {
  // Orders would come from the checkout backend; shown here as a static sample.
  const sample = [
    { id: "NE-1042", name: "Amina", ig: "@amina.mv", items: "Tide Locket + Cowrie Charm", total: 1130, status: "Awaiting transfer" },
    { id: "NE-1041", name: "Yusuf", ig: "@yusuf", items: "Reef Chain", total: 760, status: "Paid · packing" },
    { id: "NE-1040", name: "Layla", ig: "@layla.co", items: "Shoreline Cuff", total: 640, status: "Delivered" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-left text-olive/40">
            <th className="py-2 font-normal">Order</th>
            <th className="py-2 font-normal">Customer</th>
            <th className="py-2 font-normal">Items</th>
            <th className="py-2 font-normal">Total</th>
            <th className="py-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-olive/10">
          {sample.map((o) => (
            <tr key={o.id}>
              <td className="py-3 text-olive/70">{o.id}</td>
              <td className="py-3"><span className="text-olive-deep">{o.name}</span> <span className="text-olive/45">{o.ig}</span></td>
              <td className="py-3 text-olive/70">{o.items}</td>
              <td className="py-3 text-olive/70">{currency(o.total)}</td>
              <td className="py-3"><span className="rounded-full bg-olive/10 px-3 py-1 text-xs text-olive">{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditModal({ editing, setEditing, save }) {
  const set = (patch) => setEditing({ ...editing, ...patch });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chrome/50 p-4" onClick={() => setEditing(null)}>
      <div className="w-full max-w-lg rounded-lg bg-ivory p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="wordmark mb-4 text-2xl text-olive-deep">Edit {editing.name}</h2>
        <div className="space-y-3">
          <Row label="Name"><input value={editing.name} onChange={(e) => set({ name: e.target.value })} className={inp} /></Row>
          <Row label="Price (MVR)"><input type="number" value={editing.price} onChange={(e) => set({ price: Number(e.target.value) })} className={inp} /></Row>
          <Row label="Category">
            <select value={editing.category} onChange={(e) => set({ category: e.target.value })} className={inp}>
              <option value="necklaces">Necklaces</option>
              <option value="bracelets">Bracelets</option>
              <option value="charms">Charms</option>
            </select>
          </Row>
          <Row label="Blurb"><input value={editing.blurb} onChange={(e) => set({ blurb: e.target.value })} className={inp} /></Row>
          <Row label="Description"><textarea value={editing.description} onChange={(e) => set({ description: e.target.value })} className={inp} rows={3} /></Row>
          <Row label="Care"><input value={editing.care} onChange={(e) => set({ care: e.target.value })} className={inp} /></Row>
          <label className="flex items-center gap-2 text-sm text-olive/70">
            <input type="checkbox" checked={!!editing.charmReady} onChange={(e) => set({ charmReady: e.target.checked })} />
            Can hold charms (shows in builder)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setEditing(null)} className="rounded-full border border-olive/25 px-5 py-2 text-sm text-olive/70">Cancel</button>
          <button onClick={save} className="rounded-full bg-olive px-6 py-2 text-sm text-cream">Save</button>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full rounded border border-olive/20 bg-cream px-3 py-2 text-sm text-olive-deep outline-none focus:border-olive";
function Row({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow text-olive/40">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
