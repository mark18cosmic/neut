// Placeholder "lifestyle" imagery: warm, natural gradient washes with a soft
// grain and organic shapes standing in for driftwood / sand / shell photography.
// Swap these for real photos by replacing this component with next/image.
export default function Photo({ tone = ["#5A6642", "#B79B75"], label, className = "", tall = false }) {
  const [a, b] = tone;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: tall ? "3 / 4" : "1 / 1" }}
      role="img"
      aria-label={label || "Neut lifestyle photograph"}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 25% 20%, ${b} 0%, ${a} 55%, #2E3621 100%)`,
        }}
      />
      {/* soft sun flare */}
      <div
        className="absolute"
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
        style={{
          bottom: "34%",
          height: "1px",
          background: "rgba(243,237,226,0.35)",
        }}
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
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
