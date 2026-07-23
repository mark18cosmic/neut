export default function Logo({ size = 56, className = "" }) {
  // Circular olive badge with a cream ligature-style "neut" wordmark
  // and a small sparkle accent over the e.
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-olive text-cream shadow-sm ${className}`}
      style={{ width: size, height: size }}
      aria-label="Neut"
    >
      <span className="relative leading-none">
        <span
          className="wordmark"
          style={{ fontSize: size * 0.42, letterSpacing: "-0.03em" }}
        >
          neut
        </span>
        <svg
          className="absolute"
          style={{ top: -size * 0.06, left: size * 0.24, width: size * 0.14, height: size * 0.14 }}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2c.6 4.8 2.6 6.8 7.4 7.4C14.6 10 12.6 12 12 16.8 11.4 12 9.4 10 4.6 9.4 9.4 8.8 11.4 6.8 12 2Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </span>
  );
}
