/**
 * The games registry.
 *
 * This file holds only what does NOT change between releases — the
 * pitch, the art, the tags. Version numbers, download links and patch
 * notes are read at runtime from each game's own versions.json, so
 * shipping an update never requires touching the portfolio.
 *
 * TO ADD A GAME:
 *   1. Add an entry here. `slug` MUST equal the GitHub repo name — it
 *      is also the URL path (dwarvenengineering.com/<slug>).
 *   2. Enable Pages on that repo and publish a versions.json at its
 *      root (see game-kit/versions.json for the schema).
 *   That is the whole procedure.
 */
export const GAMES = [
  {
    slug: "dwarven-depths",
    title: "Dwarven Depths",
    tagline: "Dig greedily. Dig deep.",
    blurb:
      "A handheld-first mining roguelike. Every shaft you sink is a bet: " +
      "the gems are deeper than the air is, and the rock remembers where " +
      "you have been. Built for the Anbernic in landscape, plays fine on a " +
      "desktop with a pad.",
    tags: ["Godot 4", "Roguelike", "Handheld", "Solo"],
    status: "in-development",
    art: null, // e.g. "/art/dwarven-depths.png" — drop the file in public/art/
    platforms: ["Windows", "Anbernic (Linux)"],
  },
];

/** Games are shown newest-first; `order` lets you override that. */
export function orderedGames() {
  return [...GAMES].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
