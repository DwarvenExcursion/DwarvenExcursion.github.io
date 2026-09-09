/**
 * The Dwarven Engineering mark: a mountain cut open to show the vein of
 * gold inside it. All straight lines — it stays legible down to 16px as
 * a favicon.
 */
export default function Mark({ size = 30, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Dwarven Engineering"
    >
      <defs>
        <linearGradient id="mark-gold" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="var(--gold-bright)" />
          <stop offset="45%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>

      {/* the mountain, cut as flat facets */}
      <path
        d="M16 2 L30 28 H2 Z"
        fill="none"
        stroke="var(--stone-300)"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      {/* the shadowed face */}
      <path d="M16 2 L30 28 H16 Z" fill="rgba(0,0,0,0.45)" />

      {/* the vein */}
      <path
        d="M16 9 L21 17 L16 22 L11 17 Z"
        fill="url(#mark-gold)"
      />
      <path
        d="M16 22 V28"
        stroke="url(#mark-gold)"
        strokeWidth="2"
      />
    </svg>
  );
}
