import { RuneDivider } from "./GoldInlay";
import SocialIcon from "./SocialIcon";
import { SITE, SOCIALS } from "../data/site";
import "./components.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="page">
        <RuneDivider />
        <div className="footer__inner" style={{ marginTop: "2rem" }}>
          <p className="footer__note">
            © {new Date().getFullYear()} {SITE.name} · {SITE.domain}
          </p>
          <nav className="footer__links" aria-label="Footer">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                className="footer__social"
                href={s.href}
                target="_blank"
                rel="noreferrer"
              >
                <SocialIcon id={s.id} />
                {s.label}
              </a>
            ))}
            <a className="footer__social" href={`mailto:${SITE.email}`}>
              Email
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
