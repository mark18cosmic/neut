import Link from "next/link";
import Logo from "./Logo";
import { DEFAULT_CONTENT } from "@/lib/site";

export default function Footer({ content = DEFAULT_CONTENT.footer }) {
  const instagram = content.instagram || "neut.co";
  return (
    <footer className="bg-chrome text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <span className="wordmark text-3xl text-cream">neut</span>
          </div>
          <p className="mt-5 max-w-xs font-serif text-lg leading-relaxed text-cream/80">
            {content.tagline}
          </p>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4 text-cream/50">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/shop" className="link-grow hover:text-cream">Shop all</Link></li>
            <li><Link href="/builder" className="link-grow hover:text-cream">Charm builder</Link></li>
            <li><Link href="/journal" className="link-grow hover:text-cream">Journal &amp; drops</Link></li>
            <li><Link href="/about" className="link-grow hover:text-cream">About</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4 text-cream/50">Reach us</p>
          <ul className="space-y-2">
            <li>
              <a
                href={`https://instagram.com/${instagram}`}
                className="link-grow hover:text-cream"
                target="_blank"
                rel="noreferrer"
              >
                @{instagram} on Instagram
              </a>
            </li>
            {(content.notes || []).map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Neut · Malé, Maldives
      </div>
    </footer>
  );
}
