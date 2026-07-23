import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-chrome text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <span className="wordmark text-3xl text-cream">neut</span>
          </div>
          <p className="mt-5 max-w-xs font-serif text-lg leading-relaxed text-cream/80">
            Created by us, curated for you. Handmade in Malé, Maldives.
          </p>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4 text-cream/50">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/shop" className="hover:text-cream">Shop all</Link></li>
            <li><Link href="/builder" className="hover:text-cream">Charm builder</Link></li>
            <li><Link href="/journal" className="hover:text-cream">Journal &amp; drops</Link></li>
            <li><Link href="/about" className="hover:text-cream">About</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4 text-cream/50">Reach us</p>
          <ul className="space-y-2">
            <li>
              <a href="https://instagram.com/neut.co" className="hover:text-cream" target="_blank" rel="noreferrer">
                @neut.co on Instagram
              </a>
            </li>
            <li>Orders &amp; questions via Instagram DM</li>
            <li>Payment by bank transfer</li>
            <li>Island-wide delivery</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Neut · Malé, Maldives
      </div>
    </footer>
  );
}
