/** Shared studio page heading. */
export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="animate-riseIn">
        <p className="eyebrow text-clay">{eyebrow}</p>
        <h1 className="wordmark mt-1.5 text-4xl leading-none text-olive-deep">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-olive/55">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
