import GameCard from "../components/GameCard";
import { InlayMeander } from "../components/GoldInlay";
import "./sections.css";

export default function Games({ games, manifests }) {
  return (
    <section className="section" id="games">
      <div className="page">
        <header className="section-head">
          <span className="eyebrow">The Works</span>
          <h2>Games</h2>
          <InlayMeander className="section-head__rule" height={12} />
        </header>

        <div className="games__list">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} manifest={manifests[game.slug]} />
          ))}
        </div>
      </div>
    </section>
  );
}
