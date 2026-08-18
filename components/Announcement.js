import Link from "next/link";

/** Thin bar above the navigation. Text, link and visibility are admin-set. */
export default function Announcement({ text, href }) {
  if (!text) return null;
  const inner = (
    <span className="eyebrow inline-flex items-center gap-2 text-cream/80 transition group-hover:text-cream">
      {text}
      {href && <span aria-hidden="true">→</span>}
    </span>
  );

  return (
    <div className="bg-olive-deep py-2 text-center">
      {href ? (
        <Link href={href} className="group">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
