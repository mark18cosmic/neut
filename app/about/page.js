import Link from "next/link";
import Photo from "@/components/Photo";
import Logo from "@/components/Logo";

export const metadata = { title: "About — Neut" };

export default function AboutPage() {
  return (
    <>
      <section className="relative">
        <Photo tone={["#3F4A2E", "#B79B75"]} label="Hands making jewelry by the sea" className="h-[60vh] min-h-[380px] w-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-chrome/25 px-6 text-center">
          <div className="text-cream">
            <Logo size={72} className="mx-auto" />
            <h1 className="wordmark mt-6 text-5xl sm:text-6xl">Our story</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="eyebrow text-clay">Malé, Maldives</p>
        <p className="mt-6 font-serif text-3xl leading-snug text-olive-deep">
          Neut began the way most quiet things do — with our hands, a length of
          chain, and the shoreline for a workbench.
        </p>
        <p className="mt-8 leading-relaxed text-olive/75">
          We make in small batches, close to the sea. A cowrie found on a morning
          walk. A piece of driftwood worn smooth by the tide. We set what the
          island gives us, and we make it to be worn every day — layered, lived in,
          added to over time.
        </p>
        <p className="mt-5 leading-relaxed text-olive/75">
          Nothing here is mass-made. Each drop is a season of small things,
          gathered and finished by us — then curated for you. That’s the whole of
          it: <span className="font-serif italic">created by us, curated for you.</span>
        </p>
      </section>

      <section className="grid gap-3 px-3 pb-3 md:grid-cols-3">
        <Photo tone={["#B79B75", "#5A6642"]} label="Driftwood and tools" tall className="rounded-sm" />
        <Photo tone={["#E3D5BF", "#B79B75"]} label="Charms on sand" tall className="rounded-sm" />
        <Photo tone={["#5A6642", "#3F4A2E"]} label="Necklace on skin" tall className="rounded-sm" />
      </section>

      <section className="mx-auto max-w-xl px-5 py-20 text-center">
        <h2 className="wordmark text-4xl text-olive-deep">Come say hello</h2>
        <p className="mt-4 text-olive/70">
          We take orders and answer questions on Instagram, and confirm every
          piece personally. Payment is by bank transfer, with island-wide delivery.
        </p>
        <a
          href="https://instagram.com/neut.co"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-block rounded-full bg-olive px-8 py-3 text-sm text-cream transition hover:bg-olive-deep"
        >
          Message @neut.co
        </a>
        <p className="mt-4 text-sm">
          <Link href="/shop" className="text-olive/60 underline underline-offset-4">or browse the collection</Link>
        </p>
      </section>
    </>
  );
}
