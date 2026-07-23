import Photo from "@/components/Photo";

export const metadata = { title: "Journal & Drops — Neut" };

const posts = [
  {
    tag: "New Drop",
    title: "Low Tide",
    date: "July 2026",
    tone: ["#5A6642", "#B79B75"],
    body: "Our warm-season drop — lockets, cowrie and driftwood charms gathered along the reef. Small batch, as always.",
  },
  {
    tag: "Charm",
    title: "How to layer",
    date: "June 2026",
    tone: ["#B79B75", "#3F4A2E"],
    body: "Start with one chain you’ll never take off. Add a charm that means something. Leave room for the next season.",
  },
  {
    tag: "Behind the scenes",
    title: "A morning walk",
    date: "May 2026",
    tone: ["#E3D5BF", "#5A6642"],
    body: "Every piece starts on the sand. Here’s what a gathering morning looks like before anything reaches the bench.",
  },
  {
    tag: "Note",
    title: "A short break",
    date: "April 2026",
    tone: ["#3F4A2E", "#B79B75"],
    body: "We’re pausing new orders for a little while to restock. Back soon — thank you for waiting with us.",
  },
];

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-12 text-center">
        <p className="eyebrow text-clay">Journal &amp; Drops</p>
        <h1 className="wordmark mt-2 text-5xl text-olive-deep">From the shoreline</h1>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.title} className="group">
            <div className="overflow-hidden rounded-sm">
              <Photo
                tone={p.tone}
                label={p.title}
                className="transition-transform duration-[1200ms] group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-4">
              <span className="eyebrow text-clay">{p.tag} · {p.date}</span>
              <h2 className="wordmark mt-1 text-3xl text-olive-deep">{p.title}</h2>
              <p className="mt-2 leading-relaxed text-olive/70">{p.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
