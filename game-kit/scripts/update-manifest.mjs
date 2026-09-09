#!/usr/bin/env node
/**
 * Regenerates a game's versions.json for a new release.
 *
 * This is the single point where a release becomes visible to both the
 * website and every installed copy of the game, so it does the fiddly
 * parts itself: hashing the built files, rolling the previous release
 * into history, and keeping the file shape stable.
 *
 * USAGE
 *   node update-manifest.mjs \
 *     --manifest docs/versions.json \
 *     --version 0.4.2 \
 *     --notes NOTES.md \
 *     --build windows=dist/DwarvenDepths-0.4.2-setup.exe \
 *     --build linux-arm64=dist/DwarvenDepths-0.4.2-arm64.zip \
 *     --repo DwarvenExcursion/dwarven-depths
 *
 * Each --build is platform=path-to-the-file-on-disk. The download URL is
 * derived from the repo and tag, and the size and SHA-256 are read from
 * the file itself — so the manifest can never claim a hash that does not
 * match what was actually shipped.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { basename } from "node:path";

// ---------------------------------------------------------------- args

function parseArgs(argv) {
  const out = { build: [] };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    const value = argv[i + 1];
    if (key === "build") out.build.push(value);
    else out[key] = value;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

for (const required of ["manifest", "version", "repo"]) {
  if (!args[required]) {
    console.error(`Missing --${required}`);
    process.exit(1);
  }
}

const version = args.version.replace(/^v/, "");
const tag = `v${version}`;

// --------------------------------------------------------------- notes

/**
 * Patch notes are one bullet per line. Markdown list markers are
 * stripped so the same file reads correctly in the game's panel, which
 * renders plain text.
 */
function readNotes(path) {
  if (!path || !existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim().replace(/^[-*+]\s+/, ""))
    .filter((l) => l.length > 0 && !l.startsWith("#"));
}

const notes = readNotes(args.notes);

// -------------------------------------------------------------- builds

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const builds = {};
for (const spec of args.build) {
  const eq = spec.indexOf("=");
  if (eq === -1) {
    console.error(`Malformed --build "${spec}", expected platform=path`);
    process.exit(1);
  }

  const platform = spec.slice(0, eq);
  const file = spec.slice(eq + 1);

  if (!existsSync(file)) {
    console.error(`Build file not found: ${file}`);
    process.exit(1);
  }

  builds[platform] = {
    url: `https://github.com/${args.repo}/releases/download/${tag}/${basename(file)}`,
    size: statSync(file).size,
    sha256: sha256(file),
  };

  // Only Windows installs itself, and only it needs installer flags.
  if (platform === "windows") {
    builds[platform].installerArgs = "/SILENT /NORESTART /CLOSEAPPLICATIONS";
  }
}

if (Object.keys(builds).length === 0) {
  console.error("No --build entries given; refusing to publish a release with no downloads.");
  process.exit(1);
}

// ------------------------------------------------------------ manifest

const previous = existsSync(args.manifest)
  ? JSON.parse(readFileSync(args.manifest, "utf8"))
  : {};

const slug = args.repo.split("/")[1];

// Roll the outgoing release into history, newest first, and never let
// the same version appear twice.
const history = [previous.latest, ...(previous.history ?? [])]
  .filter((r) => r && r.version && r.version !== version)
  .map(({ version: v, released, notes: n }) => ({ version: v, released, notes: n ?? [] }));

const manifest = {
  schema: 1,
  game: slug,
  title: previous.title ?? slug,
  page: `https://dwarvenengineering.com/${slug}`,
  latest: {
    version,
    released: new Date().toISOString().slice(0, 10),
    mandatory: args.mandatory === "true",
    notes,
    builds,
  },
  history: history.slice(0, 25),
};

writeFileSync(args.manifest, JSON.stringify(manifest, null, 2) + "\n");

console.log(`Wrote ${args.manifest} for ${tag}`);
for (const [platform, b] of Object.entries(builds)) {
  console.log(`  ${platform.padEnd(12)} ${(b.size / 1048576).toFixed(1)} MB  ${b.sha256.slice(0, 12)}…`);
}
