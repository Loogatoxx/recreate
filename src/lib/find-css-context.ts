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

/** Find every (selector, property) pair where the property value contains `value`. */
export function findCssContext(css: string, value: string): CssContext[] {
  const out: CssContext[] = [];
  if (!value) return out;

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
      if (val.includes(value)) {
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
