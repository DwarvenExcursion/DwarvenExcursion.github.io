#!/usr/bin/env node
/**
 * Generates the QR code each game shows in its update panel.
 *
 * A game's page URL never changes, so the QR is generated once at build
 * time rather than encoded at runtime — which keeps a QR encoder out of
 * the game entirely.
 *
 *   npm run qr
 *
 * Writes game-kit/assets/<slug>-qr.png. Copy that into the game project
 * as res://assets/update_qr.png.
 */

import QRCode from "qrcode";
import { mkdirSync } from "node:fs";
import { GAMES } from "../src/data/games.js";
import { SITE } from "../src/data/site.js";

const OUT = "game-kit/assets";
mkdirSync(OUT, { recursive: true });

// Dark modules in parchment, light modules transparent, so the code sits
// on the stone panel without a white card around it.
const options = {
  errorCorrectionLevel: "M",
  margin: 2,
  width: 320,
  color: {
    dark: "#ece3d2ff",
    light: "#00000000",
  },
};

for (const game of GAMES) {
  const url = `${SITE.origin}/${game.slug}`;
  const file = `${OUT}/${game.slug}-qr.png`;
  await QRCode.toFile(file, url, options);
  console.log(`${file}  →  ${url}`);
}
