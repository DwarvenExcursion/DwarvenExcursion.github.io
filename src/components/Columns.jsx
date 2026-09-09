import { useEffect, useRef } from "react";
import Column from "./Column";
import { BAND_CYCLE } from "./GoldInlay";
import "./components.css";

/** How fast the inlay drifts relative to the page. 1 would pin it to the
 *  document and look static; 0 would nail it to the viewport. */
const DRIFT = 0.35;

/**
 * The pair of columns framing the whole page.
 *
 * They span the full height of the content rather than sitting inside the
 * hero, so the capital is at the top, the shaft runs the entire length of
 * the page, and the plinth lands on the footer like the column is bearing
 * the weight of it.
 *
 * The inlay drifts as you scroll -- slower than the page, so the gold
 * appears to travel up the shaft. Because the shift is taken modulo one
 * full motif cycle, the band never shows a seam no matter how far you go.
 */
export default function Columns() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect a reduced-motion preference: the columns still render, they
    // just stop travelling.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    // Written straight from the scroll handler rather than coalesced through
    // requestAnimationFrame. A single custom-property write is cheap, and
    // gating on rAF meant that anywhere rAF is throttled -- a background tab,
    // an embedded preview -- the in-flight guard never cleared and the drift
    // latched off permanently.
    const update = () => {
      const shift = (window.scrollY * DRIFT) % BAND_CYCLE;
      el.style.setProperty("--inlay-shift", `${shift}px`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="columns" ref={ref} aria-hidden="true">
      <Column side="left" />
      <Column side="right" />
    </div>
  );
}
