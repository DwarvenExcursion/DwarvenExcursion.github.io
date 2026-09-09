# Game kit

Everything a game repo needs to publish itself under
`dwarvenengineering.com/<repo-name>` and update itself on the player's
machine.

Nothing in this folder is used by the portfolio site — copy it into the
game repo.

---

## How an update actually reaches your friends

```
you: git tag v0.4.2 && git push origin v0.4.2
        │
        ▼
 GitHub Actions  ──► exports the game
                 ──► builds the Inno installer
                 ──► publishes a GitHub Release
                 ──► rewrites docs/versions.json  ◄── the moment it matters
        │
        ▼
 dwarvenengineering.com/dwarven-depths/versions.json
        │
        ├──► the website reads it → new version + patch notes appear
        │
        └──► the game reads it on launch → stone panel → "Download & Install"
                                          → verifies SHA-256
                                          → runs installer /SILENT
                                          → relaunches
```

The manifest is written **last** in the workflow, so a build that dies
halfway never announces an update whose files are not downloadable yet.

---

## One-time setup, per game repo

### 1. Name the repo after the URL you want

The repo name *is* the path. `dwarven-depths` →
`dwarvenengineering.com/dwarven-depths`. Lowercase, hyphens, no spaces.

### 2. Files

| Copy this | To there |
|---|---|
| `godot/update_checker.gd` | `autoload/update_checker.gd` |
| `godot/update_panel.gd` | `autoload/update_panel.gd` |
| `installer/dwarven-depths.iss` | `installer/<your-game>.iss` |
| `scripts/update-manifest.mjs` | `scripts/update-manifest.mjs` |
| `workflows/release.yml` | `.github/workflows/release.yml` |
| `versions.json` | `docs/versions.json` (strip the `_comment` keys) |

Also create `docs/index.html` — the game's own landing page — and
`NOTES.md`, which holds the patch notes for the release you are about to
cut.

### 3. Godot

1. **Project Settings → Application → Config → Version** — set it to
   `0.4.2` (no `v`). The checker reads the version from here, so it lives
   in exactly one place.
2. **Project Settings → Globals → Autoload** — add, in this order:
   - `UpdateChecker` → `res://autoload/update_checker.gd`
   - `UpdatePanel` → `res://autoload/update_panel.gd`
3. Edit `GAME_SLUG` at the top of `update_checker.gd` to the repo name.
4. From your main menu scene:

```gdscript
func _ready() -> void:
    UpdateChecker.update_available.connect(UpdatePanel.show_update)
    # Nothing is shown when the check fails or the game is current, so
    # these two are optional — connect them only if you want to log it.
    UpdateChecker.check_failed.connect(func(why): print("Update check: ", why))
    UpdateChecker.check_for_update()
```

That is the entire integration. The check is non-blocking and times out
after 8 seconds, so a player with no connection sees nothing at all.

### 4. Installer

Open the `.iss` and change:

- `AppId` — **generate a fresh GUID for each game** (Inno Setup:
  Tools → Generate GUID). Reusing one across two games makes each
  installer uninstall the other.
- `AppName`, `ExeName`, `AppURL`
- `SourceDir` — where your Godot export lands. In CI this is
  `build\windows`.

### 5. Turn on Pages for the repo

Settings → Pages → **Deploy from a branch** → `main` / `docs`.

**Do not add a CNAME file to a game repo.** The custom domain is claimed
once, by the `DwarvenExcursion.github.io` repo. Every other repo with
Pages enabled is served under it automatically. A second CNAME fights
the first.

---

## Cutting a release

```bash
# 1. Write the notes — one bullet per line.
$EDITOR NOTES.md

# 2. Tag and push.
git tag v0.4.2
git push origin v0.4.2
```

Watch the Actions tab. When it goes green, the site and every installed
copy of the game know about `0.4.2`.

To do it by hand instead:

```bash
node scripts/update-manifest.mjs \
  --manifest docs/versions.json \
  --version 0.4.2 \
  --notes NOTES.md \
  --repo DwarvenExcursion/dwarven-depths \
  --build windows=dist/DwarvenDepths-0.4.2-setup.exe
```

---

## Things worth knowing before you rely on this

**SmartScreen.** An unsigned installer downloaded from the internet gets
a blue "Windows protected your PC" screen until it builds reputation.
Your friends will hit this on the *first* install. After that the game
updates itself and they never see it again. The install guide on the
site explains the click-through. A code-signing certificate (~$100–200/yr
for OV, and EV is what actually clears SmartScreen instantly) is the only
real fix, and is not worth it at this scale.

**Per-user install.** `PrivilegesRequired=lowest` means no UAC prompt
when the game launches the installer. This is deliberate: an elevation
dialog the player did not ask for is how an auto-updater gets mistaken
for malware. The cost is that the game installs per-user, not per-machine.

**The handheld does not self-install.** `can_self_install()` returns
false off Windows, so the Anbernic build shows the panel with the link
and the player re-copies the build to the SD card. Silently swapping
files on a device someone is holding is not a thing to do.

**The hash is not optional.** The panel refuses to run an installer whose
SHA-256 does not match the manifest, and deletes it. `update-manifest.mjs`
computes hashes from the actual built files, so they cannot drift.
