import { InlayBand } from "./GoldInlay";
import "./components.css";

/**
 * A load-bearing dwarven column: stepped capital, fluted shaft with a
 * gold inlay running its full height, stepped plinth.
 *
 * Purely decorative, so it is hidden from assistive tech and dropped
 * entirely on narrow screens (see components.css) — a column that has
 * to shrink to fit a phone stops reading as architecture.
 *
 * @param {"left"|"right"} side  Which way the capital's shadow falls.
 */
export default function Column({ side = "left", className = "" }) {
  return (
    <div className={`column column--${side} ${className}`} aria-hidden="true">
      <div className="column__capital">
        <span className="column__abacus" />
        <span className="column__corbel" />
        <span className="column__necking" />
      </div>

      <div className="column__shaft">
        <div className="column__flutes" />
        <InlayBand className="column__inlay" width={26} height={900} />
      </div>

      <div className="column__base">
        <span className="column__necking" />
        <span className="column__corbel" />
        <span className="column__plinth" />
      </div>
    </div>
  );
}
