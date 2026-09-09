import { useMemo } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Games from "./sections/Games";
import Devlog from "./sections/Devlog";
import Downloads from "./sections/Downloads";
import { orderedGames } from "./data/games";
import { useManifests } from "./hooks/useManifests";

export default function App() {
  // Stable identity, or useManifests would refetch on every render.
  const games = useMemo(() => orderedGames(), []);
  const { manifests, loading } = useManifests(games);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Games games={games} manifests={manifests} />
        <Devlog games={games} manifests={manifests} loading={loading} />
        <Downloads games={games} manifests={manifests} />
      </main>
      <Footer />
    </>
  );
}
