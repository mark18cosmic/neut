"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Shared studio controls. Everything here follows the storefront palette —
// olive on ivory, Cormorant for headings, Jost for UI — so the studio reads as
// the same product as the shop.
// ---------------------------------------------------------------------------

export const inputClass =
  "w-full rounded-md border border-olive/20 bg-ivory px-3 py-2.5 text-sm text-olive-deep outline-none transition duration-200 placeholder:text-olive/30 focus:border-olive focus:ring-2 focus:ring-olive/15";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="eyebrow text-olive/45">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-olive/40">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function Panel({ title, subtitle, actions, children, className = "" }) {
  return (
    <section
      className={`animate-riseIn rounded-xl border border-olive/10 bg-cream/70 p-5 shadow-[0_1px_0_rgba(63,74,46,0.06)] transition duration-300 hover:shadow-[0_8px_30px_rgba(63,74,46,0.07)] sm:p-6 ${className}`}
    >
      {(title || actions) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="wordmark text-2xl text-olive-deep">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-olive/55">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function Button({ variant = "primary", className = "", busy = false, children, ...rest }) {
  const styles = {
    primary: "bg-olive text-cream hover:bg-olive-deep hover:shadow-lg",
    ghost: "border border-olive/25 text-olive/75 hover:border-olive hover:text-olive-deep",
    danger: "border border-clay/60 text-clay hover:bg-clay hover:text-chrome",
    dark: "bg-chrome text-cream hover:bg-olive-deep",
  }[variant];

  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm transition duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-55 ${styles} ${className}`}
    >
      {busy && (
        <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm text-olive/75"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition duration-300 ${
          checked ? "bg-olive" : "bg-olive/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-all duration-300 ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}

export function Badge({ tone = "olive", children }) {
  const tones = {
    olive: "bg-olive/10 text-olive",
    clay: "bg-clay/25 text-olive-deep",
    sand: "bg-sand/60 text-olive-deep",
    muted: "bg-olive/5 text-olive/50",
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs ${tones[tone] || tones.olive}`}>
      {children}
    </span>
  );
}

/** Two swatches used as the fallback wash behind a section with no photo. */
export function ToneField({ value = ["#5A6642", "#B79B75"], onChange }) {
  const [a, b] = value;
  return (
    <div className="flex items-center gap-3">
      {[0, 1].map((i) => (
        <input
          key={i}
          type="color"
          aria-label={i === 0 ? "Deep tone" : "Warm tone"}
          value={value[i]}
          onChange={(e) => {
            const next = [...value];
            next[i] = e.target.value;
            onChange(next);
          }}
          className="h-9 w-12 cursor-pointer rounded border border-olive/20 bg-ivory p-0.5"
        />
      ))}
      <span
        className="h-9 flex-1 rounded"
        style={{ background: `radial-gradient(120% 120% at 25% 20%, ${b}, ${a} 55%, #2E3621)` }}
      />
    </div>
  );
}

/**
 * Picture control: drop or choose a file and it goes straight to the Supabase
 * `media` bucket, or paste a URL if the photo already lives somewhere else.
 */
export function ImageField({ value, onChange, folder = "site" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const upload = useCallback(
    async (file) => {
      if (!file) return;
      if (!supabaseConfigured) {
        setError("Connect Supabase before uploading — you can paste an image URL meanwhile.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("That file isn't an image.");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError("Images need to be under 8MB.");
        return;
      }

      setBusy(true);
      setError(null);
      try {
        const supabase = createClient();
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;

        const { data } = supabase.storage.from("media").getPublicUrl(path);
        onChange(data.publicUrl);
      } catch (e) {
        setError(e.message || "Upload failed.");
      } finally {
        setBusy(false);
      }
    },
    [folder, onChange]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex min-h-[132px] items-center gap-4 overflow-hidden rounded-lg border border-dashed p-3 transition duration-300 ${
          dragging ? "border-olive bg-sand/40" : "border-olive/25 bg-ivory"
        }`}
      >
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-olive/10">
          {value ? (
            // Studio preview only — next/image isn't needed for an admin thumbnail.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Current selection" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[0.6rem] uppercase tracking-widest text-olive/35">
              None
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-olive/70">
            {busy ? "Uploading…" : "Drop a photo here, or"}{" "}
            {!busy && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="link-grow text-olive-deep"
              >
                choose a file
              </button>
            )}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="…or paste an image URL"
            className={`${inputClass} mt-2`}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="mt-2 text-xs text-olive/45 transition hover:text-clay"
            >
              Remove picture
            </button>
          )}
        </div>

        {busy && <span className="shimmer absolute inset-x-0 bottom-0 h-0.5 animate-shimmer" />}
      </div>
      {error && <p className="mt-2 text-xs text-clay">{error}</p>}
    </div>
  );
}

/** Bottom-right transient confirmation. */
export function Toast({ message, tone = "ok", onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;
  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-50 animate-toastIn rounded-full px-5 py-3 text-sm shadow-xl ${
        tone === "error" ? "bg-clay text-chrome" : "bg-olive text-cream"
      }`}
    >
      {message}
    </div>
  );
}

/** Centred sheet used for the product and post editors. */
export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-chrome/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl animate-sheetUp flex-col rounded-t-2xl bg-ivory shadow-2xl sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-olive/10 px-6 py-4">
          <h2 className="wordmark text-2xl text-olive-deep">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-full text-olive/50 transition hover:bg-olive/10 hover:text-olive-deep"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-olive/10 px-6 py-4">{footer}</footer>
        )}
      </div>
    </div>
  );
}

/** Ask before anything irreversible. */
export function useConfirm() {
  return useCallback((message) => window.confirm(message), []);
}
