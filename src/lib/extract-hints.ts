export type VisualHints = {
  colors: string[];
  sizes: string[];
  fonts: string[];
  /** font-weight values (numeric like "700" or keyword like "bold"). */
  weights: string[];
};

const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g;
const SIZE_RE = /(?<![\w.])(\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw))(?![\w.])/g;
const FONT_RE = /font-family\s*:\s*([^;}\n]+)/g;
// Matches `font-weight: <value>`. Captures numeric (100, 200…900) or keyword
// (normal, bold, lighter, bolder). `inherit`/`initial`/`unset` are excluded — they
// don't give the learner any actual value to write.
const WEIGHT_RE = /font-weight\s*:\s*(100|200|300|400|500|600|700|800|900|normal|bold|lighter|bolder)\b/gi;

// Sizes that are universal CSS defaults, so listing them as ingredients would
// just be noise. `100%` and `1px` used to be here but they're frequent real
// answers (full-width CTAs, thin separators), so they stay.
const TRIVIAL_SIZES = new Set(['0px', '0rem', '0em']);

function normalizeColor(c: string): string {
  // Lowercase hex, leave rgb/hsl as-is (their spacing may differ).
  if (c.startsWith('#')) return c.toLowerCase();
  return c.replace(/\s+/g, ' ').trim();
}

function normalizeFont(f: string): string {
  return f.replace(/\s+/g, ' ').trim();
}

export function extractHints(css: string): VisualHints {
  const colors = new Set<string>();
  const sizes = new Set<string>();
  const fonts = new Set<string>();
  const weights = new Set<string>();

  for (const m of css.matchAll(COLOR_RE)) {
    colors.add(normalizeColor(m[0]));
  }

  for (const m of css.matchAll(SIZE_RE)) {
    const value = m[1];
    if (!TRIVIAL_SIZES.has(value)) sizes.add(value);
  }

  for (const m of css.matchAll(FONT_RE)) {
    fonts.add(normalizeFont(m[1]));
  }

  for (const m of css.matchAll(WEIGHT_RE)) {
    weights.add(m[1].toLowerCase());
  }

  return {
    colors: [...colors],
    sizes: [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b)),
    fonts: [...fonts],
    weights: [...weights].sort((a, b) => {
      const an = Number(a);
      const bn = Number(b);
      // Numbers first (ascending), then keywords alphabetically.
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
      if (!Number.isNaN(an)) return -1;
      if (!Number.isNaN(bn)) return 1;
      return a.localeCompare(b);
    }),
  };
}
