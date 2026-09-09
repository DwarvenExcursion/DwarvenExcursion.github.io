import { useEffect, useState } from "react";
import { manifestUrl } from "../data/site";

/**
 * Fetches every game's versions.json at runtime.
 *
 * This is deliberately runtime rather than build-time: publishing a
 * release in a game repo should make the portfolio show the new version
 * immediately, with no rebuild and no second commit. The cost is one
 * small request per game, which is fine at this scale.
 *
 * A game whose manifest is missing or malformed simply renders without
 * version info — a repo that is not live yet must not break the page.
 *
 * @param {Array<{slug: string}>} games
 * @returns {{ manifests: Record<string, object>, loading: boolean }}
 */
export function useManifests(games) {
  const [manifests, setManifests] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadOne(slug) {
      try {
        const res = await fetch(manifestUrl(slug), {
          signal: controller.signal,
          cache: "no-cache",
        });
        if (!res.ok) return [slug, null];
        const data = await res.json();
        // Guard against a half-written manifest taking the page down.
        if (!data || typeof data.latest?.version !== "string") return [slug, null];
        return [slug, data];
      } catch {
        return [slug, null];
      }
    }

    Promise.all(games.map((g) => loadOne(g.slug))).then((entries) => {
      if (cancelled) return;
      setManifests(Object.fromEntries(entries.filter(([, m]) => m)));
      setLoading(false);
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [games]);

  return { manifests, loading };
}

/**
 * Flattens all manifests into one reverse-chronological release feed.
 * This is what the devlog renders, so patch notes are written once — in
 * the game's manifest — and appear both in-game and on the site.
 */
export function toReleaseFeed(games, manifests) {
  const entries = [];

  for (const game of games) {
    const m = manifests[game.slug];
    if (!m) continue;

    const releases = [m.latest, ...(m.history ?? [])];
    for (const r of releases) {
      if (!r?.version) continue;
      entries.push({
        game: game.title,
        slug: game.slug,
        version: r.version,
        released: r.released ?? null,
        notes: Array.isArray(r.notes) ? r.notes : [],
      });
    }
  }

  return entries.sort((a, b) => {
    if (!a.released) return 1;
    if (!b.released) return -1;
    return b.released.localeCompare(a.released);
  });
}
