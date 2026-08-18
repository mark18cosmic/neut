"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import { Badge, Button, Field, ImageField, Modal, Toast, Toggle, ToneField, inputClass } from "./ui";
import { deletePost, savePost } from "@/app/admin/actions";

const BLANK = {
  id: null,
  slug: "",
  title: "",
  tag: "New Drop",
  dateline: "",
  body: "",
  tone: ["#5A6642", "#B79B75"],
  image: null,
  position: 0,
  published: true,
};

const TAGS = ["New Drop", "Charm", "Behind the scenes", "Note"];

export default function JournalManager({ initial }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [toast, setToast] = useState(null);

  async function run(fn, message) {
    const result = await fn();
    if (result?.ok) {
      setToast({ message, tone: "ok" });
      router.refresh();
    } else {
      setToast({ message: result?.error || "Something went wrong.", tone: "error" });
    }
    return result;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <PageHeader
        eyebrow="Studio"
        title="Journal"
        subtitle="Drops and behind-the-scenes notes, shown on the Journal page."
        actions={<Button onClick={() => setEditing({ ...BLANK })}>+ New post</Button>}
      />

      {initial.length === 0 ? (
        <p className="py-20 text-center font-serif text-2xl text-olive/45">
          Nothing written yet.
        </p>
      ) : (
        <div className="grid gap-4 stagger sm:grid-cols-2">
          {initial.map((p) => (
            <article
              key={p.id || p.slug}
              className="group overflow-hidden rounded-xl border border-olive/10 bg-cream/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_34px_rgba(63,74,46,0.10)]"
            >
              <div
                className="h-32 bg-cover bg-center"
                style={
                  p.image
                    ? { backgroundImage: `url(${p.image})` }
                    : {
                        background: `radial-gradient(120% 120% at 25% 20%, ${p.tone[1]}, ${p.tone[0]} 55%, #2E3621)`,
                      }
                }
              />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Badge tone="sand">{p.tag}</Badge>
                  {!p.published && <Badge tone="muted">Draft</Badge>}
                  <span className="ml-auto text-xs text-olive/40">{p.dateline}</span>
                </div>
                <h2 className="wordmark mt-2 text-2xl text-olive-deep">{p.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-olive/60">{p.body}</p>
                <button
                  onClick={() => setEditing({ ...p })}
                  className="link-grow mt-3 text-xs text-olive/60"
                >
                  Edit post
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <PostForm
          value={editing}
          onClose={() => setEditing(null)}
          onDelete={() => setConfirming(editing)}
          onSave={async (draft) => {
            const result = await run(() => savePost(draft), "Post saved.");
            if (result?.ok) setEditing(null);
          }}
        />
      )}

      {confirming && (
        <Modal
          title={`Delete “${confirming.title}”?`}
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
                  const result = await run(() => deletePost(target.id), "Post deleted.");
                  if (result?.ok) setEditing(null);
                }}
              >
                Delete permanently
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-olive/70">
            The post disappears from the Journal page for good. To hide it without losing the
            writing, untick <em>Published</em> instead.
          </p>
        </Modal>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
}

function PostForm({ value, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <Modal
      title={draft.id ? "Edit post" : "New post"}
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
            Save post
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Picture">
          <ImageField value={draft.image} onChange={(image) => set({ image })} folder="journal" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input value={draft.title} onChange={(e) => set({ title: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Web address (slug)" hint="Leave blank to build it from the title.">
            <input value={draft.slug} onChange={(e) => set({ slug: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Tag">
            <select value={draft.tag} onChange={(e) => set({ tag: e.target.value })} className={inputClass}>
              {TAGS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Dateline" hint="Free text, e.g. July 2026.">
            <input
              value={draft.dateline}
              onChange={(e) => set({ dateline: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Body">
          <textarea
            rows={5}
            value={draft.body}
            onChange={(e) => set({ body: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="Fallback wash">
          <ToneField value={draft.tone} onChange={(tone) => set({ tone })} />
        </Field>

        <div className="flex flex-wrap items-center gap-6 rounded-lg bg-cream/60 p-4">
          <Toggle checked={draft.published} onChange={(published) => set({ published })} label="Published" />
          <label className="flex items-center gap-2 text-sm text-olive/70">
            <span className="eyebrow text-olive/45">Order</span>
            <input
              type="number"
              value={draft.position}
              onChange={(e) => set({ position: e.target.value })}
              className="w-20 rounded border border-olive/20 bg-ivory px-2 py-1 text-sm"
            />
          </label>
        </div>
      </div>
    </Modal>
  );
}
