const LOGO_BASE = "/logos";

/** Locally hosted logo for light mode. */
export function logoLight(slug: string) {
  return `${LOGO_BASE}/${slug}.png`;
}

/** Locally hosted logo for dark mode. */
export function logoDark(slug: string) {
  return `${LOGO_BASE}/${slug}-dark.png`;
}
