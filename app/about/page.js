import Link from "next/link";
import Photo from "@/components/Photo";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "About — Neut" };

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;
  const instagram = content.footer.instagram || "neut.co";

  return (
    <>
      <section className="relative">
        <Photo
          src={about.heroImageUrl}
          tone={["#3F4A2E", "#B79B75"]}
          label={about.heroAlt}
          fill
          priority
          animate
          sizes="100vw"
          className="h-[60vh] min-h-[380px] w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-chrome/25 px-6 text-center">
          <div className="animate-fadeUp text-cream">
            <Logo size={72} className="mx-auto" />
            <h1 className="wordmark mt-6 text-5xl sm:text-6xl">{about.heroTitle}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-20 text-center">
        <Reveal>
          <p className="eyebrow text-clay">{about.eyebrow}</p>
          <p className="mt-6 font-serif text-3xl leading-snug text-olive-deep">{about.lede}</p>
          <p className="mt-8 leading-relaxed text-olive/75">{about.body1}</p>
          <p className="mt-5 leading-relaxed text-olive/75">{about.body2}</p>
        </Reveal>
      </section>

      <section className="grid gap-3 stagger px-3 pb-3 md:grid-cols-3">
        <Photo tone={["#B79B75", "#5A6642"]} label="Driftwood and tools" tall className="rounded-sm" />
        <Photo tone={["#E3D5BF", "#B79B75"]} label="Charms on sand" tall className="rounded-sm" />
        <Photo tone={["#5A6642", "#3F4A2E"]} label="Necklace on skin" tall className="rounded-sm" />
      </section>

      <section className="mx-auto max-w-xl px-5 py-20 text-center">
        <Reveal>
          <h2 className="wordmark text-4xl text-olive-deep">{about.contactTitle}</h2>
          <p className="mt-4 text-olive/70">{about.contactBody}</p>
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-block rounded-full bg-olive px-8 py-3 text-sm text-cream transition duration-300 hover:-translate-y-0.5 hover:bg-olive-deep hover:shadow-lg"
          >
            Message @{instagram}
          </a>
          <p className="mt-4 text-sm">
            <Link href="/shop" className="link-grow text-olive/60">
              or browse the collection
            </Link>
          </p>
        </Reveal>
      </section>
    </>
  );
}
