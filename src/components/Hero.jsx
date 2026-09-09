import Column from "./Column";
import { RuneDivider } from "./GoldInlay";
import { SITE } from "../data/site";
import "../sections/sections.css";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <Column side="left" />
      <Column side="right" />

      {/* Lamplight from above, the way a hall is lit. */}
      <div className="hero__light" aria-hidden="true" />

      <div className="page hero__inner">
        <span className="eyebrow">Est. in the deep places</span>

        <h1 className="hero__title">
          Dwarven
          <br />
          <span className="gilded">Engineering</span>
        </h1>

        <RuneDivider className="hero__divider" />

        <p className="lede hero__lede">{SITE.tagline}</p>
        <p className="hero__sub">
          Solo game development in Godot 4 — handheld-first design, tight
          systems, and builds that update themselves so the people playing
          them never have to go looking.
        </p>

        <div className="hero__actions">
          <a className="btn btn--gold" href="#games">
            See the works
          </a>
          <a className="btn btn--stone" href="#downloads">
            Downloads
          </a>
        </div>
      </div>
    </section>
  );
}
