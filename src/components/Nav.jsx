import Mark from "./Mark";
import { InlayMeander } from "./GoldInlay";
import { SITE } from "../data/site";
import "./components.css";

const LINKS = [
  { href: "#games", label: "Games" },
  { href: "#devlog", label: "Devlog" },
  { href: "#downloads", label: "Downloads" },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="page nav__inner">
        <a className="nav__mark" href="#top">
          <Mark size={28} />
          <span>{SITE.name}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} className="nav__link" href={l.href}>
              {l.label}
            </a>
          ))}
          <a
            className="btn btn--stone btn--sm"
            href={`https://github.com/${SITE.githubUser}`}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
      <InlayMeander className="nav__meander" height={8} />
    </header>
  );
}
