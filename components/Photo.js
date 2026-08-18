import Image from "next/image";

/**
 * Photography slot.
 *
 * When the admin has uploaded a picture (`src`), it renders that through
 * next/image. With no picture it falls back to the original warm gradient wash
 * — driftwood / sand / shell tones — so the site never shows a broken frame
 * while the studio is still being filled in.
 */
export default function Photo({
  src = null,
  tone = ["#5A6642", "#B79B75"],
  label,
  className = "",
  tall = false,
  fill = false,
  priority = false,
  animate = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}) {
  const [a, b] = tone?.length === 2 ? tone : ["#5A6642", "#B79B75"];
  const alt = label || "Neut lifestyle photograph";

  return (
    <div
      className={`relative overflow-hidden bg-olive-deep ${className}`}
      style={fill ? undefined : { aspectRatio: tall ? "3 / 4" : "1 / 1" }}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${animate ? "animate-kenburns" : ""}`}
        />
      ) : (
        <>
          <div
            className={`absolute inset-0 ${animate ? "animate-kenburns" : ""}`}
            style={{
              background: `radial-gradient(120% 120% at 25% 20%, ${b} 0%, ${a} 55%, #2E3621 100%)`,
            }}
          />
          {/* soft sun flare */}
          <div
            className="absolute animate-drift"
            style={{
              top: "12%",
              left: "18%",
              width: "42%",
              height: "42%",
              background: "radial-gradient(circle, rgba(251,248,241,0.55), transparent 70%)",
              filter: "blur(6px)",
            }}
          />
          {/* horizon / driftwood line */}
          <div
            className="absolute left-0 right-0"
            style={{ bottom: "34%", height: "1px", background: "rgba(243,237,226,0.35)" }}
          />
          {/* organic form */}
          <div
            className="absolute rounded-full"
            style={{
              bottom: "-18%",
              right: "-10%",
              width: "60%",
              height: "60%",
              background: "rgba(46,54,33,0.35)",
              filter: "blur(20px)",
            }}
          />
        </>
      )}

      {/* grain — sits over both a real photo and the gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
