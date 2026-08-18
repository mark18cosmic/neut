import Link from "next/link";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import { getContent, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, products] = await Promise.all([getContent(), getProducts()]);
  const { hero, drop_rail, quote_break, featured, story_strip, marquee } = content;

  const live = products.filter((p) => !p.soldOut);
  const featuredItems = (products.filter((p) => p.featured).length
    ? products.filter((p) => p.featured)
    : live
  ).slice(0, 6);
  const drop = products.filter((p) => p.drop);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative">
        <Photo
          src={hero.imageUrl}
          tone={hero.tone}
          label={hero.imageAlt}
          fill
          priority
          animate
          sizes="100vw"
          className="h-[82vh] min-h-[520px] w-full"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(23,23,18,${
              (hero.overlay ?? 35) / 140
            }), transparent 45%, rgba(23,23,18,${(hero.overlay ?? 35) / 100}))`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-cream">
          {hero.showLogo && (
            <div className="animate-slowfade">
              <Logo size={80} className="mx-auto" />
            </div>
          )}
          {hero.eyebrow && (
            <p className="eyebrow mt-6 animate-fadeUp text-cream/70">{hero.eyebrow}</p>
          )}
          <h1 className="wordmark mt-8 animate-fadeUp text-5xl leading-none sm:text-7xl">
            {hero.headingTop}
            {hero.headingBottom && (
              <>
                <br />
                {hero.headingBottom}
              </>
            )}
          </h1>
          {hero.subtext && (
            <p className="mt-6 max-w-md animate-fadeUp text-sm text-cream/80 [animation-delay:200ms]">
              {hero.subtext}
            </p>
          )}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {hero.ctaLabel && (
              <Link
                href={hero.ctaHref || "/shop"}
                className="animate-fadeUp rounded-full bg-cream px-8 py-3 text-sm tracking-wide text-olive-deep transition duration-300 hover:-translate-y-0.5 hover:bg-ivory hover:shadow-lg [animation-delay:350ms]"
              >
                {hero.ctaLabel}
              </Link>
            )}
            {hero.secondaryLabel && (
              <Link
                href={hero.secondaryHref || "/builder"}
                className="animate-fadeUp rounded-full border border-cream/50 px-8 py-3 text-sm tracking-wide text-cream transition duration-300 hover:-translate-y-0.5 hover:bg-cream hover:text-olive-deep [animation-delay:450ms]"
              >
                {hero.secondaryLabel}
              </Link>
            )}
          </div>

          {/* scroll cue */}
          <span className="absolute bottom-8 flex animate-drift flex-col items-center gap-2 text-cream/60">
            <span className="eyebrow text-[0.6rem]">Scroll</span>
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M7 2v18M2 15l5 5 5-5" />
            </svg>
          </span>
        </div>
      </section>

      {/* ------------------------------------------------------------ Marquee */}
      {marquee.enabled && marquee.items?.length > 0 && <Marquee items={marquee.items} />}

      {/* ---------------------------------------------------------- Drop rail */}
      {drop.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20">
          <Reveal>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow text-clay">{drop_rail.eyebrow}</p>
                <h2 className="wordmark mt-2 text-4xl text-olive-deep">{drop_rail.title}</h2>
              </div>
              <Link
                href={drop_rail.linkHref || "/shop"}
                className="link-grow text-sm text-olive/70"
              >
                {drop_rail.linkLabel}
              </Link>
            </div>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-x-5 gap-y-10 stagger md:grid-cols-4">
            {drop.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Reveal>
        </section>
      )}

      {/* -------------------------------------------------------- Why Neut */}
      {story_strip.enabled && story_strip.items?.length > 0 && (
        <section className="border-y border-olive/10 bg-cream/60">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <Reveal>
              <div className="mb-10 text-center">
                <p className="eyebrow text-clay">{story_strip.eyebrow}</p>
                <h2 className="wordmark mt-2 text-4xl text-olive-deep">{story_strip.title}</h2>
              </div>
            </Reveal>
            <Reveal className="grid gap-8 stagger sm:grid-cols-3">
              {story_strip.items.map((item, i) => (
                <div key={i} className="group text-center">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 font-serif text-lg text-olive transition duration-500 group-hover:bg-olive group-hover:text-cream">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl text-olive-deep">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-olive/65">{item.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- Photo break */}
      <section className="relative">
        <Photo
          src={quote_break.imageUrl}
          tone={quote_break.tone}
          label={quote_break.imageAlt}
          fill
          sizes="100vw"
          className="h-[60vh] min-h-[380px] w-full"
        />
        <div className="absolute inset-0 bg-chrome/30" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <Reveal className="max-w-lg text-center text-cream">
            <p className="wordmark text-3xl leading-snug sm:text-4xl">
              “{quote_break.quote}”
            </p>
            {quote_break.ctaLabel && (
              <Link
                href={quote_break.ctaHref || "/builder"}
                className="mt-7 inline-block rounded-full border border-cream/60 px-7 py-2.5 text-sm text-cream transition duration-300 hover:-translate-y-0.5 hover:bg-cream hover:text-olive-deep"
              >
                {quote_break.ctaLabel}
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- Featured grid */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="eyebrow text-clay">{featured.eyebrow}</p>
            <h2 className="wordmark mt-2 text-4xl text-olive-deep">{featured.title}</h2>
          </div>
        </Reveal>
        <Reveal className="grid grid-cols-2 gap-x-5 gap-y-12 stagger md:grid-cols-3">
          {featuredItems.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </Reveal>
      </section>
    </>
  );
}
