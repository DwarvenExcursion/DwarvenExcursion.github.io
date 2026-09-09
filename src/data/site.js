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

export function repoUrl(slug) {
  return `https://github.com/${SITE.githubUser}/${slug}`;
}
