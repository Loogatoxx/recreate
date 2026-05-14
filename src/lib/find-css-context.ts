export type CssContext = {
  selector: string;
  property: string;
};

const RULE_RE = /([^{}]+)\{([^}]+)\}/g;

function parseRules(css: string): Array<{ selector: string; body: string }> {
  const rules: Array<{ selector: string; body: string }> = [];
  for (const m of css.matchAll(RULE_RE)) {
    rules.push({ selector: m[1].trim(), body: m[2] });
  }
  return rules;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build a regex that matches `value` as a whole CSS token — i.e. preceded by
 * the start of the string or a CSS value separator (whitespace, comma, paren,
 * slash) and followed by the end or another separator (also `;`). This avoids
 * the bug where searching "4px" matched "14px" via substring inclusion.
 */
function tokenRegex(value: string): RegExp {
  const escaped = escapeRegex(value);
  return new RegExp(`(?:^|[\\s,(/])${escaped}(?=$|[\\s,)/;])`, 'i');
}

/** Find every (selector, property) pair whose value contains `value` as a token. */
export function findCssContext(css: string, value: string): CssContext[] {
  const out: CssContext[] = [];
  if (!value) return out;
  const re = tokenRegex(value);

  for (const rule of parseRules(css)) {
    const decls = rule.body
      .split(';')
      .map((l) => l.trim())
      .filter(Boolean);

    for (const decl of decls) {
      const colon = decl.indexOf(':');
      if (colon === -1) continue;
      const prop = decl.slice(0, colon).trim();
      const val = decl.slice(colon + 1).trim();
      if (re.test(val)) {
        out.push({ selector: rule.selector, property: prop });
      }
    }
  }
  return out;
}

/** CSS selectors string ready to inject (joined by comma). */
export function selectorsForValue(css: string, value: string): string {
  const ctx = findCssContext(css, value);
  const unique = Array.from(new Set(ctx.map((c) => c.selector)));
  return unique.join(', ');
}

/**
 * Look up the exact value declared for a (selector, property) pair in the target
 * CSS. Returns null if no match. Powers the AI "reveal answer" feature in the diff
 * panel — the value comes straight from the target rather than from a model call.
 */
export function findDeclValue(
  css: string,
  selector: string,
  property: string
): string | null {
  const normSel = selector.trim();
  const normProp = property.trim().toLowerCase();
  for (const rule of parseRules(css)) {
    if (rule.selector.trim() !== normSel) continue;
    for (const decl of rule.body.split(';')) {
      const trimmed = decl.trim();
      if (!trimmed) continue;
      const colon = trimmed.indexOf(':');
      if (colon === -1) continue;
      const prop = trimmed.slice(0, colon).trim().toLowerCase();
      if (prop !== normProp) continue;
      return trimmed.slice(colon + 1).trim();
    }
  }
  return null;
}
