import { useId } from "react";

/**
 * Gold inlay ornaments.
 *
 * All of these are pure SVG so they stay crisp at any size and cost
 * nothing to load. They share one visual language: hard angles, stepped
 * geometry, no curves. Dwarves cut stone with chisels, not compasses.
 *
 * Colours come from CSS variables so the whole hold can be re-themed
 * from theme.css without touching a component.
 */

const GOLD = "var(--gold)";
const GOLD_BRIGHT = "var(--gold-bright)";
const GOLD_DEEP = "var(--gold-deep)";

/** Shared gradient + groove-shadow defs. Rendered once per instance. */
function InlayDefs({ gradId, shadowId }) {
  return (
    <defs>
      <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GOLD_BRIGHT} />
        <stop offset="38%" stopColor={GOLD} />
        <stop offset="72%" stopColor="var(--gold-mid)" />
        <stop offset="100%" stopColor={GOLD_DEEP} />
      </linearGradient>
      {/* The dark line under the metal that makes it read as *seated in*
          a cut groove rather than painted on top of the stone. */}
      <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1" stdDeviation="0" floodColor="#000" floodOpacity="0.75" />
        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#d4a94a" floodOpacity="0.35" />
      </filter>
    </defs>
  );
}

/**
 * A vertical chain of stepped diamonds — the motif that runs down the
 * shaft of every column. Tiles seamlessly at any height.
 */
/** One full cycle of the shaft motif, in pixels. Three bands, then repeat. */
export const BAND_CYCLE = 192;

export function InlayBand({ width = 26, height = 400, className = "" }) {
  const uid = useId();
  const pat = `band-${uid}`;
  const grad = `bandg-${uid}`;
  const shadow = `bands-${uid}`;

  const gold = `url(#${grad})`;

  return (
    /* No viewBox, so the motif tiles down the shaft at its true size
       rather than being stretched to whatever height the column is.
       The tile is a 192px cycle of three different bands, so a reader
       scrolling the page passes through changing inlay rather than one
       motif repeating forever. */
    <svg className={className} width={width} height={height} aria-hidden="true">
      <InlayDefs gradId={grad} shadowId={shadow} />
      <pattern id={pat} width="26" height={BAND_CYCLE} patternUnits="userSpaceOnUse">
        <g filter={`url(#${shadow})`} fill="none" stroke={gold} strokeWidth="1.75">
          {/* the spine runs unbroken through every band */}
          <path d={`M13 0 V${BAND_CYCLE}`} strokeWidth="1.5" />

          {/* band one - the open diamond and its keystone */}
          <path d="M13 12 L21 24 L13 36 L5 24 Z" />
          <path d="M13 46 L18 53 L13 60 L8 53 Z" fill={gold} stroke="none" />

          {/* band two - a stack of chevrons, like cut steps */}
          <path d="M5 78 L13 86 L21 78" />
          <path d="M5 90 L13 98 L21 90" />
          <path d="M5 102 L13 110 L21 102" />
          <path d="M7 118 H19" strokeWidth="1.5" />

          {/* band three - a set stone between two bindings */}
          <path d="M13 136 L20 140 L20 150 L13 154 L6 150 L6 140 Z" />
          <path d="M6 164 H20" strokeWidth="1.5" />
          <path d="M8 170 H18" strokeWidth="1.5" />
          <path d="M13 178 L17 182 L13 186 L9 182 Z" fill={gold} stroke="none" />
        </g>
      </pattern>
      <rect width="26" height="100%" fill={`url(#${pat})`} />
    </svg>
  );
}

/**
 * A horizontal stepped meander — the running border used under section
 * headings and along the top of the nav.
 */
export function InlayMeander({ height = 18, className = "" }) {
  const uid = useId();
  const pat = `mea-${uid}`;
  const grad = `meag-${uid}`;
  const shadow = `meas-${uid}`;

  // No viewBox on purpose: user units then equal CSS pixels, so the
  // pattern genuinely repeats across the width instead of one tile
  // being stretched to fit. patternTransform scales the motif to the
  // requested height while keeping it square.
  const scale = height / 18;

  return (
    <svg
      className={className}
      height={height}
      style={{ width: "100%", display: "block" }}
      aria-hidden="true"
    >
      <InlayDefs gradId={grad} shadowId={shadow} />
      <pattern
        id={pat}
        width="48"
        height="18"
        patternUnits="userSpaceOnUse"
        patternTransform={`scale(${scale})`}
      >
        <path
          d="M0 9 H6 V3 H18 V15 H30 V3 H42 V9 H48"
          fill="none"
          stroke={`url(#${grad})`}
          strokeWidth="1.75"
          filter={`url(#${shadow})`}
        />
      </pattern>
      <rect width="100%" height={height} fill={`url(#${pat})`} />
    </svg>
  );
}

/**
 * Four corner fittings pinned inside the edges of a stone panel.
 *
 * Each corner is its own fixed-size SVG rather than one stretched
 * overlay — a single SVG scaled to the panel would smear the brackets
 * into arcs on any panel that is not square.
 */
export function InlayCorners({ size = 20, className = "" }) {
  const uid = useId();
  const grad = `cg-${uid}`;
  const shadow = `cs-${uid}`;

  // An L drawn into the top-left of its own box; the other three are
  // mirrored with CSS transforms.
  const arm = `M1.25 ${size - 1} V5 A3.75 3.75 0 0 1 5 1.25 H${size - 1}`;

  const positions = [
    { top: 0, left: 0, transform: "none" },
    { top: 0, right: 0, transform: "scaleX(-1)" },
    { bottom: 0, left: 0, transform: "scaleY(-1)" },
    { bottom: 0, right: 0, transform: "scale(-1, -1)" },
  ];

  return (
    <span className={className} aria-hidden="true">
      {positions.map((pos, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ position: "absolute", ...pos }}
        >
          {i === 0 && <InlayDefs gradId={grad} shadowId={shadow} />}
          <g style={{ transform: pos.transform, transformOrigin: "center" }}>
            <path
              d={arm}
              fill="none"
              stroke={`url(#${grad})`}
              strokeWidth="2"
              strokeLinecap="square"
              filter={`url(#${shadow})`}
            />
          </g>
        </svg>
      ))}
    </span>
  );
}

/**
 * A centred divider: a long inlaid rule broken by a faceted gem.
 * Used between major sections.
 */
export function RuneDivider({ className = "" }) {
  const uid = useId();
  const grad = `rdg-${uid}`;
  const shadow = `rds-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 400 28"
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
    >
      <InlayDefs gradId={grad} shadowId={shadow} />
      <g filter={`url(#${shadow})`}>
        <path d="M0 14 H150" stroke={`url(#${grad})`} strokeWidth="1.5" opacity="0.85" />
        <path d="M250 14 H400" stroke={`url(#${grad})`} strokeWidth="1.5" opacity="0.85" />
        {/* the gem: an outer setting and an inner facet */}
        <path d="M200 2 L216 14 L200 26 L184 14 Z" fill="none" stroke={`url(#${grad})`} strokeWidth="2" />
        <path d="M200 8 L210 14 L200 20 L190 14 Z" fill={`url(#${grad})`} />
        {/* flanking studs */}
        <path d="M164 14 L170 9 L176 14 L170 19 Z" fill={`url(#${grad})`} opacity="0.8" />
        <path d="M224 14 L230 9 L236 14 L230 19 Z" fill={`url(#${grad})`} opacity="0.8" />
      </g>
    </svg>
  );
}
