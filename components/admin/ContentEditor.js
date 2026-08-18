"use client";

import { useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import HeroPreview from "./HeroPreview";
import {
  Button,
  Field,
  ImageField,
  Modal,
  Panel,
  Toast,
  Toggle,
  ToneField,
  inputClass,
} from "./ui";
import { BLOCK_GROUPS, CONTENT_BLOCKS } from "@/lib/site";
import { resetContentBlock, saveContentBlock } from "@/app/admin/actions";

/**
 * Every editable string, link and picture on the storefront, in one place.
 *
 * The form is generated from CONTENT_BLOCKS rather than hand-written, so a new
 * field added to lib/site.js turns up here — and on the site — automatically.
 */
export default function ContentEditor({ initial }) {
  const [group, setGroup] = useState("Home");
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmReset, setConfirmReset] = useState(null);

  const blocks = useMemo(() => CONTENT_BLOCKS.filter((b) => b.group === group), [group]);

  const dirty = useMemo(() => {
    const set = new Set();
    for (const block of CONTENT_BLOCKS) {
      if (JSON.stringify(draft[block.key]) !== JSON.stringify(initial[block.key])) set.add(block.key);
    }
    return set;
  }, [draft, initial]);

  function setField(blockKey, fieldKey, value) {
    setDraft((d) => ({ ...d, [blockKey]: { ...d[blockKey], [fieldKey]: value } }));
  }

  async function save(blockKey) {
    setSaving(blockKey);
    const result = await saveContentBlock(blockKey, draft[blockKey]);
    setSaving(null);
    setToast(
      result.ok
        ? { message: "Saved — the shop is updated.", tone: "ok" }
        : { message: result.error, tone: "error" }
    );
  }

  async function reset(blockKey) {
    setConfirmReset(null);
    setSaving(blockKey);
    const result = await resetContentBlock(blockKey);
    setSaving(null);
    if (result.ok) {
      setDraft((d) => ({ ...d, [blockKey]: result.value }));
      setToast({ message: "Restored the original copy.", tone: "ok" });
    } else {
      setToast({ message: result.error, tone: "error" });
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <PageHeader
        eyebrow="Studio"
        title="Content & hero"
        subtitle="Words, links and photography across the whole shop. Changes go live as soon as you save."
      />

      {/* Group tabs */}
      <div className="mb-7 flex gap-1 rounded-full bg-cream/70 p-1 text-sm">
        {BLOCK_GROUPS.map((g) => {
          const count = CONTENT_BLOCKS.filter((b) => b.group === g && dirty.has(b.key)).length;
          return (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`relative flex-1 rounded-full px-4 py-2 transition duration-300 ${
                group === g ? "bg-olive text-cream shadow" : "text-olive/60 hover:text-olive-deep"
              }`}
            >
              {g}
              {count > 0 && (
                <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulseRing rounded-full bg-clay align-middle" />
              )}
            </button>
          );
        })}
      </div>

      <div key={group} className="space-y-6 stagger">
        {blocks.map((block) => (
          <Panel
            key={block.key}
            title={block.label}
            subtitle={block.hint}
            actions={
              <div className="flex items-center gap-2">
                {dirty.has(block.key) && (
                  <span className="eyebrow animate-popIn text-clay">Unsaved</span>
                )}
                <Button variant="ghost" onClick={() => setConfirmReset(block)}>
                  Reset
                </Button>
                <Button
                  onClick={() => save(block.key)}
                  busy={saving === block.key}
                  disabled={!dirty.has(block.key)}
                >
                  Save
                </Button>
              </div>
            }
          >
            {block.key === "hero" && <HeroPreview hero={draft.hero} />}

            <div className="grid gap-4 sm:grid-cols-2">
              {block.fields.map((field) => (
                <div
                  key={field.key}
                  className={
                    ["textarea", "image", "cards", "lines", "tone"].includes(field.type)
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <Control
                    field={field}
                    value={draft[block.key]?.[field.key]}
                    onChange={(v) => setField(block.key, field.key, v)}
                    folder={block.key}
                  />
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      {confirmReset && (
        <Modal
          title={`Reset ${confirmReset.label}?`}
          onClose={() => setConfirmReset(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirmReset(null)}>
                Keep my copy
              </Button>
              <Button variant="danger" onClick={() => reset(confirmReset.key)}>
                Reset it
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-olive/70">
            This puts the original Neut wording back for{" "}
            <span className="text-olive-deep">{confirmReset.label}</span> and clears any picture you
            chose for it. Everything else stays as it is.
          </p>
        </Modal>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
}

/** One control, chosen by the field's declared type. */
function Control({ field, value, onChange, folder }) {
  switch (field.type) {
    case "textarea":
      return (
        <Field label={field.label}>
          <textarea
            rows={3}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </Field>
      );

    case "image":
      return (
        <Field label={field.label} hint="JPG or PNG, up to 8MB. Landscape works best.">
          <ImageField value={value} onChange={onChange} folder={folder} />
        </Field>
      );

    case "toggle":
      return (
        <div className="pt-5">
          <Toggle checked={!!value} onChange={onChange} label={field.label} />
        </div>
      );

    case "tone":
      return (
        <Field label={field.label}>
          <ToneField value={value} onChange={onChange} />
        </Field>
      );

    case "number":
      return (
        <Field label={field.label}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={field.min ?? 0}
              max={field.max ?? 100}
              value={Number(value) || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 accent-olive"
            />
            <span className="w-12 text-right text-sm text-olive/60">
              {Number(value) || 0}
              {field.suffix || ""}
            </span>
          </div>
        </Field>
      );

    case "lines":
      return (
        <Field label={field.label}>
          <textarea
            rows={4}
            value={(value || []).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
            className={inputClass}
          />
        </Field>
      );

    case "cards":
      return <CardsField field={field} value={value || []} onChange={onChange} />;

    case "url":
      return (
        <Field label={field.label}>
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/shop"
            className={inputClass}
          />
        </Field>
      );

    default:
      return (
        <Field label={field.label}>
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </Field>
      );
  }
}

/** Repeating title + body cards, e.g. the three "Why Neut" reasons. */
function CardsField({ field, value, onChange }) {
  const max = field.max || 6;

  const update = (i, key, v) =>
    onChange(value.map((item, idx) => (idx === i ? { ...item, [key]: v } : item)));

  return (
    <Field label={field.label}>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="animate-popIn rounded-lg border border-olive/15 bg-ivory p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="eyebrow text-olive/35">#{i + 1}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-xs text-olive/40 transition hover:text-clay"
              >
                Remove
              </button>
            </div>
            <input
              value={item.title || ""}
              onChange={(e) => update(i, "title", e.target.value)}
              placeholder="Title"
              className={`${inputClass} mt-2`}
            />
            <textarea
              rows={2}
              value={item.body || ""}
              onChange={(e) => update(i, "body", e.target.value)}
              placeholder="A sentence or two"
              className={`${inputClass} mt-2`}
            />
          </div>
        ))}

        {value.length < max && (
          <Button variant="ghost" type="button" onClick={() => onChange([...value, { title: "", body: "" }])}>
            + Add another
          </Button>
        )}
      </div>
    </Field>
  );
}
