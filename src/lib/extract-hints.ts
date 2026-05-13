export type VisualHints = {
  colors: string[];
  sizes: string[];
  fonts: string[];
};

const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g;
const SIZE_RE = /(?<![\w.])(\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw))(?![\w.])/g;
const FONT_RE = /font-family\s*:\s*([^;}\n]+)/g;

// Sizes that aren't pedagogically useful to surface.
const TRIVIAL_SIZES = new Set(['0px', '0rem', '0em', '100%', '1px']);

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

  return {
    colors: [...colors],
    sizes: [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b)),
    fonts: [...fonts],
  };
}
