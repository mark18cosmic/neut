import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { getContent, getJournal } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Journal & Drops — Neut" };

export default async function JournalPage() {
  const [content, posts] = await Promise.all([getContent(), getJournal()]);
  const copy = content.journal;

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="mb-12 animate-riseIn text-center">
        <p className="eyebrow text-clay">{copy.eyebrow}</p>
        <h1 className="wordmark mt-2 text-5xl text-olive-deep">{copy.title}</h1>
      </header>

      {posts.length === 0 ? (
        <p className="py-20 text-center font-serif text-2xl text-olive/50">
          Nothing written yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-10 md:grid-cols-2">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 90}>
              <article className="group">
                <div className="overflow-hidden rounded-sm">
                  <Photo
                    src={p.image}
                    tone={p.tone}
                    label={p.title}
                    className="transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4">
                  <span className="eyebrow text-clay">
                    {p.tag}
                    {p.dateline ? ` · ${p.dateline}` : ""}
                  </span>
                  <h2 className="wordmark mt-1 text-3xl text-olive-deep">{p.title}</h2>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-olive/70">{p.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
