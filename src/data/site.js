/**
 * Site-wide configuration. Everything that is "yours" rather than
 * "the theme" lives here.
 */
export const SITE = {
  name: "Dwarven Engineering",
  domain: "dwarvenengineering.com",
  origin: "https://dwarvenengineering.com",
  tagline: "Games cut from the rock, one seam at a time.",
  githubUser: "DwarvenExcursion",
  email: "austin.mount@gmail.com",
};

/**
 * Where else to find the work. Order is deliberate: the two places you
 * actually publish come before the code host.
 */
export const SOCIALS = [
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@dwarvenexcursions" },
  { id: "twitch", label: "Twitch", href: "https://www.twitch.tv/dwarvenexcursions" },
  { id: "github", label: "GitHub", href: `https://github.com/${SITE.githubUser}` },
];

/**
 * Where a game's live manifest lives.
 *
 * GitHub Pages serves every project repo under the account's custom
 * domain at /<repo-name>/, so a repo called `dwarven-depths` publishes
 * to dwarvenengineering.com/dwarven-depths/. The manifest sits at the
 * root of that publish directory.
 *
 * In `npm run dev` we read from /mock/<slug>.versions.json instead, so
 * the site is workable before any game repo is live.
 */
export function manifestUrl(slug) {
  return import.meta.env.DEV
    ? `/mock/${slug}.versions.json`
    : `${SITE.origin}/${slug}/versions.json`;
}

export function gamePageUrl(slug) {
  return `${SITE.origin}/${slug}`;
}

/**
 * The key art for a game, taken from the game's own Pages site.
 *
 * Same principle as the manifest: the game repo owns its assets, and the
 * portfolio reads them. Replacing shot.png in the game repo updates this
 * card too, with no commit here and no second copy to drift.
 *
 * Unlike the manifest this is not fetched, just pointed at — so it works
 * in dev against the live domain, and a game whose page is not published
 * yet simply fails to load and falls back to the placeholder.
 */
export function gameArtUrl(slug) {
  return `${SITE.origin}/${slug}/shot.png`;
}

export function repoUrl(slug) {
  return `https://github.com/${SITE.githubUser}/${slug}`;
}
