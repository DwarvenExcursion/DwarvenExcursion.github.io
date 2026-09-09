import { useState } from "react";
import StonePanel from "./StonePanel";
import { gameArtUrl, gamePageUrl, repoUrl } from "../data/site";
import "./components.css";

const STATUS_LABEL = {
  released: "Released",
  "in-development": "In development",
  prototype: "Prototype",
};

function formatBytes(n) {
  if (!n) return null;
  const mb = n / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * One game, with its live version pulled from the game's own manifest.
 * `manifest` may be null — a game whose repo is not published yet still
 * gets a card, just without version or download info.
 */
export default function GameCard({ game, manifest }) {
  const latest = manifest?.latest;
  const win = latest?.builds?.windows;

  // Prefer art committed here, then whatever the manifest declares, then the
  // screenshot on the game's own page. If none of them load we fall back to
  // the carved placeholder rather than leaving a broken image in the slab.
  const artSrc = game.art ?? manifest?.art ?? gameArtUrl(game.slug);
  const [artFailed, setArtFailed] = useState(false);
  const showArt = Boolean(artSrc) && !artFailed;

  return (
    <StonePanel as="article" className="card">
      <div className={`card__art ${showArt ? "" : "card__art--empty"}`}>
        {showArt ? (
          <img
            src={artSrc}
            alt={`${game.title} screenshot`}
            loading="lazy"
            onError={() => setArtFailed(true)}
          />
        ) : (
          <span className="card__art-mark">Art forthcoming</span>
        )}
      </div>

      <div>
        <div className="card__meta">
          <span className="tag tag--gold">{STATUS_LABEL[game.status] ?? game.status}</span>
          {game.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>

        <h3 className="card__title">{game.title}</h3>
        <p className="card__blurb">{game.blurb}</p>

        <div className="card__version">
          {latest ? (
            <>
              <span>Latest</span>
              <strong className="mono">v{latest.version}</strong>
              {latest.released && <span>· {latest.released}</span>}
              {win?.size && <span>· {formatBytes(win.size)}</span>}
            </>
          ) : (
            <span>No public build yet</span>
          )}
          <a
            className="card__source"
            href={repoUrl(game.slug)}
            target="_blank"
            rel="noreferrer"
          >
            source
          </a>
        </div>

        <div className="card__actions">
          {win?.url ? (
            <a className="btn btn--gold" href={win.url}>
              Download for Windows
            </a>
          ) : (
            <button className="btn btn--gold" disabled>
              Not yet available
            </button>
          )}
          <a className="btn btn--stone" href={gamePageUrl(game.slug)}>
            Game page
          </a>
        </div>
      </div>
    </StonePanel>
  );
}
