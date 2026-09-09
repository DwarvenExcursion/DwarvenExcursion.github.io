import StonePanel from "../components/StonePanel";
import { InlayMeander } from "../components/GoldInlay";
import "./sections.css";

const PLATFORM_LABEL = {
  windows: "Windows",
  "linux-arm64": "Anbernic / Linux ARM64",
  linux: "Linux x86_64",
  web: "Play in browser",
};

function formatBytes(n) {
  if (!n) return null;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function Downloads({ games, manifests }) {
  const withBuilds = games.filter((g) => manifests[g.slug]?.latest?.builds);

  return (
    <section className="section" id="downloads">
      <div className="page">
        <header className="section-head">
          <span className="eyebrow">Provisioning</span>
          <h2>Downloads</h2>
          <InlayMeander className="section-head__rule" height={12} />
          <p className="lede" style={{ marginTop: "1rem" }}>
            Install once. After that each game checks for its own updates on
            launch and pulls them down itself — you will not need to come back
            here.
          </p>
        </header>

        {withBuilds.length === 0 ? (
          <StonePanel sunken>
            <p className="devlog__empty">
              No published builds yet. Once a game repo publishes a manifest,
              its installers are listed here automatically.
            </p>
          </StonePanel>
        ) : (
          <div className="downloads__list">
            {withBuilds.map((game) => {
              const latest = manifests[game.slug].latest;
              return (
                <StonePanel key={game.slug} className="downloads__game">
                  <div className="downloads__head">
                    <h3>{game.title}</h3>
                    <span className="tag tag--gold mono">v{latest.version}</span>
                  </div>

                  <ul className="downloads__builds">
                    {Object.entries(latest.builds).map(([platform, build]) => (
                      <li key={platform} className="downloads__build">
                        <div>
                          <span className="downloads__platform">
                            {PLATFORM_LABEL[platform] ?? platform}
                          </span>
                          {build.size && (
                            <span className="downloads__size mono">
                              {formatBytes(build.size)}
                            </span>
                          )}
                        </div>
                        <a className="btn btn--stone btn--sm" href={build.url}>
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </StonePanel>
              );
            })}
          </div>
        )}

        {/* --- install guide --- */}
        <div className="downloads__guides">
          <StonePanel sunken className="downloads__guide">
            <h3 className="downloads__guide-title">Windows</h3>
            <ol className="downloads__steps">
              <li>Run the installer you downloaded above.</li>
              <li>
                Windows may show a blue <em>&ldquo;Windows protected your
                PC&rdquo;</em> screen — this is SmartScreen reacting to a new,
                unsigned installer, not a virus warning. Click{" "}
                <strong>More info</strong>, then <strong>Run anyway</strong>.
              </li>
              <li>
                Launch from the Start Menu. The game checks for updates on
                startup and installs them for you.
              </li>
            </ol>
          </StonePanel>

          <StonePanel sunken className="downloads__guide">
            <h3 className="downloads__guide-title">Anbernic handheld</h3>
            <ol className="downloads__steps">
              <li>Power the device down and take out the SD card.</li>
              <li>
                Copy the ARM64 build into your ports folder — on ArkOS and
                similar, that is <code className="mono">/roms/ports/</code>.
              </li>
              <li>
                Put the card back, and find the game under <strong>Ports</strong>{" "}
                in the menu.
              </li>
              <li>
                Handheld builds notify you when an update exists but do not
                install it themselves — you will re-copy the new build.
              </li>
            </ol>
          </StonePanel>
        </div>
      </div>
    </section>
  );
}
