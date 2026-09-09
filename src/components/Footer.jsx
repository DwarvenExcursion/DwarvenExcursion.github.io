import { RuneDivider } from "./GoldInlay";
import { SITE } from "../data/site";
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
            <a href={`https://github.com/${SITE.githubUser}`} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={`mailto:${SITE.email}`}>Email</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
