/** Slow horizontal strip of brand phrases. Content is admin-editable. */
export default function Marquee({ items = [] }) {
  if (!items.length) return null;
  const run = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-olive/10 bg-olive py-3 text-cream">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {run.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="eyebrow px-6 text-cream/80">{item}</span>
            <span className="text-clay">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
