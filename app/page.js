import Link from "next/link";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import Logo from "@/components/Logo";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  const featured = PRODUCTS.filter((p) => !p.soldOut).slice(0, 6);
  const drop = PRODUCTS.filter((p) => p.drop);

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <Photo
          tone={["#5A6642", "#B79B75"]}
          label="Neut jewelry on driftwood in warm island light"
          className="h-[82vh] min-h-[520px] w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-chrome/30 via-transparent to-chrome/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-cream">
          <div className="animate-slowfade">
            <Logo size={80} className="mx-auto" />
          </div>
          <h1 className="wordmark mt-8 animate-fadeUp text-5xl leading-none sm:text-7xl">
            Created by us,
            <br />
            curated for you.
          </h1>
          <p className="mt-6 max-w-md animate-fadeUp text-sm text-cream/80 [animation-delay:200ms]">
            Handmade charms, bracelets and necklaces — gathered from the shoreline
            of Malé, Maldives.
          </p>
          <Link
            href="/shop"
            className="mt-9 animate-fadeUp rounded-full bg-cream px-8 py-3 text-sm tracking-wide text-olive-deep transition hover:bg-ivory [animation-delay:350ms]"
          >
            Shop the New Drop
          </Link>
        </div>
      </section>

      {/* Drop strip */}
      {drop.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow text-clay">Latest Drop</p>
              <h2 className="wordmark mt-2 text-4xl text-olive-deep">Low Tide</h2>
            </div>
            <Link href="/shop" className="text-sm text-olive/70 underline-offset-4 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {drop.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Full-width photo break */}
      <section className="relative">
        <Photo
          tone={["#3F4A2E", "#B79B75"]}
          label="Charm locket resting on a palm frond"
          className="h-[60vh] min-h-[380px] w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-lg text-center text-cream">
            <p className="wordmark text-3xl leading-snug sm:text-4xl">
              “Layer the charms you love. Rebuild your story, season to season.”
            </p>
            <Link
              href="/builder"
              className="mt-7 inline-block rounded-full border border-cream/60 px-7 py-2.5 text-sm text-cream transition hover:bg-cream hover:text-olive-deep"
            >
              Build your charms
            </Link>
          </div>
        </div>
      </section>

      {/* Featured grid */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow text-clay">The collection</p>
          <h2 className="wordmark mt-2 text-4xl text-olive-deep">Quietly worn favourites</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
