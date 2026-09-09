/**
 * Brand glyphs, drawn as single paths so they inherit currentColor and sit
 * on the stone the same way the rest of the metalwork does.
 *
 * These are the platforms' own marks, so unlike the ornaments they keep
 * their real shapes rather than being redrawn in the angular house style.
 */
const PATHS = {
  youtube:
    "M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.8 12 3.8 12 3.8s-7.5 0-9.4.6A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
  twitch:
    "M4.3 0 1 3.3v17.4h5.9V24l3.3-3.3h4.9L21.7 15V0H4.3Zm15.5 14.2-3.3 3.3h-5.9L8 20.4v-2.9H3.6V1.6h16.2v12.6ZM16.4 5.6v6.5h-2V5.6h2Zm-5.4 0v6.5H9V5.6h2Z",
  github:
    "M12 .5C5.4.5 0 5.9 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C21.3 4.2 22.3 4.5 22.3 4.5c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12.1 12.1 0 0 0 24 12.6C24 5.9 18.6.5 12 .5Z",
};

export default function SocialIcon({ id, size = 18 }) {
  const d = PATHS[id];
  if (!d) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
