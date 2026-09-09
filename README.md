# Dwarven Engineering — portfolio

The site at **dwarvenengineering.com**. React + Vite, deployed to GitHub
Pages.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

---

## How the whole thing fits together

```
DwarvenExcursion.github.io   (this repo)
    └── dwarvenengineering.com/            ← the portfolio
                                              claims the custom domain

dwarven-depths               (a game repo)
    └── dwarvenengineering.com/dwarven-depths/
            ├── index.html                 ← the game's own page
            └── versions.json              ← what the game reads on launch
```

GitHub serves every project repo with Pages enabled under the account's
custom domain, at a path equal to the repo name. So a game's page lives
in the game's repo, next to its source, and still answers on your domain.

**The custom domain is claimed once, here.** `public/CNAME` holds
`dwarvenengineering.com`. Game repos must not have a CNAME file of their
own — they inherit.

The portfolio reads each game's `versions.json` at runtime. Publishing a
release in a game repo makes the version, the download link and the patch
notes appear here with no rebuild and no second commit.

---

## First-time setup

### 1. Create the repo and push

The repo **must** be named exactly `DwarvenExcursion.github.io`.

```bash
git remote add origin https://github.com/DwarvenExcursion/DwarvenExcursion.github.io.git
git push -u origin main
```

### 2. Turn on Pages

Settings → Pages → Source: **GitHub Actions**.

(Not "Deploy from a branch" — `.github/workflows/deploy.yml` builds the
Vite app and publishes `dist/`.)

### 3. Point the domain at GitHub — GoDaddy

**My Products → dwarvenengineering.com → DNS → Manage Zones.**

First **delete** the parked records GoDaddy creates by default: the `A`
record on `@` pointing at a GoDaddy IP, and the `CNAME` on `www`
pointing at `_domainconnect` or similar. Leaving them causes an
intermittent wrong-site-loads problem that is miserable to diagnose.

Then add these. GoDaddy writes the apex as `@`.

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 600 |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |
| AAAA | `@` | `2606:50c0:8000::153` | 600 |
| AAAA | `@` | `2606:50c0:8001::153` | 600 |
| AAAA | `@` | `2606:50c0:8002::153` | 600 |
| AAAA | `@` | `2606:50c0:8003::153` | 600 |
| CNAME | `www` | `dwarvenexcursion.github.io.` | 600 |

All four A records are required — they are GitHub's edge servers, not
alternatives to each other.

### 4. Set the domain on GitHub

Settings → Pages → Custom domain → `dwarvenengineering.com` → Save.
Wait for the DNS check to pass, then tick **Enforce HTTPS**.

Certificate provisioning takes anywhere from a few minutes to an hour
after DNS propagates. Until it finishes, the site is reachable but the
browser will complain — that is expected, not a misconfiguration.

Verify from a terminal:

```bash
nslookup dwarvenengineering.com
```

You want the four `185.199.*` addresses back.

---

## Adding a game

1. Add an entry to [`src/data/games.js`](src/data/games.js). The `slug`
   must equal the repo name.
2. Set up the game repo using [`game-kit/`](game-kit/README.md).
3. Drop a screenshot in `public/art/` and point the entry's `art` field
   at it.

That is all. Versions, downloads and devlog entries arrive on their own
from the game's manifest.

---

## Layout

```
src/
  data/site.js        domain, GitHub account, manifest URLs
  data/games.js       the games registry — the file you edit most
  hooks/useManifests  runtime fetch of every game's versions.json
  styles/theme.css    every colour and font, as variables
  styles/global.css   stone surfaces, gold inlay, buttons, type
  components/         Column, StonePanel, GoldInlay, Nav, Hero, GameCard
  sections/           Games, Devlog, Downloads
public/
  CNAME               claims dwarvenengineering.com — do not remove
  mock/               fake manifests so `npm run dev` has data to show
game-kit/             drop-in kit for the game repos (not part of the site)
```

### Re-theming

Every colour is a variable in `src/styles/theme.css`. The stone ramp is
`--stone-850` (darkest) through `--stone-300`; the metal is
`--gold-shadow` through `--gold-bright`. Change those and the columns,
inlays, buttons and the in-game update panel all move together — the
Godot panel in `game-kit/godot/update_panel.gd` carries the same hex
values, so update both if you shift the palette.

The ornaments in `src/components/GoldInlay.jsx` are pure SVG built from
straight lines and stepped geometry. If you add motifs, keep to that —
the whole look depends on there being no curves in the metalwork.

---

## Local development notes

`npm run dev` reads manifests from `public/mock/` instead of the live
domain, so the site has realistic data before any game repo exists. The
switch is `import.meta.env.DEV` in `src/data/site.js`.

`dev.cmd` exists only because Node was installed mid-session and the
shell had a stale PATH. Once `npm` works in a fresh terminal, delete it.
