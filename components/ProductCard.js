import Link from "next/link";
import Photo from "./Photo";
import Price from "./Price";

export default function ProductCard({ product, tall = false }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-sm">
        <Photo
          src={product.image}
          tone={product.tone}
          label={product.name}
          tall={tall}
          sizes="(max-width: 768px) 50vw, 33vw"
          className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        {product.drop && (
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-olive">
            {product.drop}
          </span>
        )}
        {product.soldOut && (
          <span className="absolute inset-0 flex items-center justify-center bg-chrome/45">
            <span className="rounded-full border border-cream/70 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-cream">
              Sold out
            </span>
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="font-serif text-xl leading-tight text-olive-deep transition-colors duration-300 group-hover:text-olive">
          {product.name}
        </h3>
        <Price mvr={product.price} className="text-sm text-olive/70" />
      </div>
      <p className="mt-0.5 text-sm text-olive/55">{product.blurb}</p>
    </Link>
  );
}
