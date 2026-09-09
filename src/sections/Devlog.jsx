import { InlayMeander } from "../components/GoldInlay";
import StonePanel from "../components/StonePanel";
import { toReleaseFeed } from "../hooks/useManifests";
import "./sections.css";

/**
 * The devlog is not a separate content store — it is every game's
 * release history, flattened. Patch notes get written once, in the
 * game's versions.json, and appear both here and inside the game's
 * update panel.
 */
export default function Devlog({ games, manifests, loading }) {
  const feed = toReleaseFeed(games, manifests);

  return (
    <section className="section" id="devlog">
      <div className="page">
        <header className="section-head">
          <span className="eyebrow">Cut into the wall</span>
          <h2>Devlog</h2>
          <InlayMeander className="section-head__rule" height={12} />
          <p className="lede" style={{ marginTop: "1rem" }}>
            Every release, newest first. These are the same notes the games
            show you when they update themselves.
          </p>
        </header>

        {loading ? (
          <p className="devlog__empty mono">Reading the tablets…</p>
        ) : feed.length === 0 ? (
          <StonePanel sunken>
            <p className="devlog__empty">
              No releases published yet. The first entry appears here the
              moment a game repo publishes its manifest.
            </p>
          </StonePanel>
        ) : (
          <ol className="devlog__list">
            {feed.map((entry) => (
              <li key={`${entry.slug}-${entry.version}`} className="devlog__entry">
                <div className="devlog__stamp">
                  <span className="devlog__version mono">v{entry.version}</span>
                  {entry.released && (
                    <time className="devlog__date mono" dateTime={entry.released}>
                      {entry.released}
                    </time>
                  )}
                </div>

                <StonePanel corners={false} className="devlog__body inlay-edge">
                  <h3 className="devlog__game">{entry.game}</h3>
                  {entry.notes.length > 0 ? (
                    <ul className="devlog__notes">
                      {entry.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="devlog__empty">No notes recorded for this release.</p>
                  )}
                </StonePanel>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
