import Mark from "./Mark";
import { InlayMeander } from "./GoldInlay";
import SocialIcon from "./SocialIcon";
import { SITE, SOCIALS } from "../data/site";
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
          <span className="nav__social">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                className="nav__icon"
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <SocialIcon id={s.id} size={17} />
              </a>
            ))}
          </span>
        </nav>
      </div>
      <InlayMeander className="nav__meander" height={8} />
    </header>
  );
}
