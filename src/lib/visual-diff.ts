import pixelmatch from 'pixelmatch';
import html2canvas from 'html2canvas-pro';

type Declaration = { property: string; value: string };
type Rule = { selector: string; declarations: Declaration[] };

const RULE_RE = /([^{}]+)\{([^}]+)\}/g;

function parseDecls(body: string): Declaration[] {
  const out: Declaration[] = [];
  for (const raw of body.split(';')) {
    const t = raw.trim();
    if (!t) continue;
    const colon = t.indexOf(':');
    if (colon === -1) continue;
    out.push({
      property: t.slice(0, colon).trim(),
      value: t.slice(colon + 1).trim(),
    });
  }
  return out;
}

function parseRules(css: string): Rule[] {
  const rules: Rule[] = [];
  for (const m of css.matchAll(RULE_RE)) {
    rules.push({
      selector: m[1].trim(),
      declarations: parseDecls(m[2]),
    });
  }
  return rules;
}

export type DeclStats = {
  total: number;
  matched: number;
  unmatched: Array<{ selector: string; property: string }>;
};

/**
 * For every (selector, property) in `targetCss`, check whether the user's rendering
 * computes the same value as the target's rendering for that same property on the
 * matched element. Returns totals + matched count.
 *
 * "Matched" is rendering equality, not source-string equality — so `padding: 1rem`
 * vs `padding: 16px` both count as a match if the resolved computed value is the same.
 */
export function declarationStats(
  targetCss: string,
  userRoot: Element,
  targetRoot: Element
): DeclStats {
  let total = 0;
  let matched = 0;
  const unmatched: Array<{ selector: string; property: string }> = [];
  const seenUnmatched = new Set<string>();

  for (const rule of parseRules(targetCss)) {
    if (rule.declarations.length === 0) continue;

    let targetEls: Element[] = [];
    try {
      targetEls = Array.from(targetRoot.querySelectorAll(rule.selector));
    } catch {
      continue;
    }
    if (targetEls.length === 0) continue;

    let userEls: Element[] = [];
    try {
      userEls = Array.from(userRoot.querySelectorAll(rule.selector));
    } catch {
      // selector parse failed in user — leave userEls empty
    }

    for (let i = 0; i < targetEls.length; i++) {
      const targetEl = targetEls[i];
      const userEl = userEls[i];
      for (const decl of rule.declarations) {
        total++;
        const isMatch =
          userEl &&
          (() => {
            const tVal = getComputedStyle(targetEl).getPropertyValue(decl.property);
            const uVal = getComputedStyle(userEl).getPropertyValue(decl.property);
            return tVal !== '' && tVal === uVal;
          })();
        if (isMatch) {
          matched++;
        } else {
          // Dedup by (selector, property) — multiple elements of same selector shouldn't bloat the list.
          const key = `${rule.selector}|${decl.property}`;
          if (!seenUnmatched.has(key)) {
            seenUnmatched.add(key);
            unmatched.push({ selector: rule.selector, property: decl.property });
          }
        }
      }
    }
  }

  return { total, matched, unmatched };
}

/** Pixel similarity ratio between two rendered elements. 0 = totally different, 1 = identical. */
export async function pixelRatio(userEl: HTMLElement, targetEl: HTMLElement): Promise<number> {
  const opts = { logging: false, scale: 1, backgroundColor: '#ffffff' };
  const [a, b] = await Promise.all([html2canvas(userEl, opts), html2canvas(targetEl, opts)]);

  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  if (w === 0 || h === 0) return 0;

  const ctxA = a.getContext('2d')!.getImageData(0, 0, w, h);
  const ctxB = b.getContext('2d')!.getImageData(0, 0, w, h);

  const diff = pixelmatch(
    ctxA.data as unknown as Uint8Array,
    ctxB.data as unknown as Uint8Array,
    null as any,
    w,
    h,
    { threshold: 0.15 }
  );
  return Math.max(0, Math.min(1, 1 - diff / (w * h)));
}

/**
 * Compute the user's progress score given the current declaration stats and the
 * baseline stats (captured at starter state).
 *
 * Score = 0   when current matched === baseline matched (the user hasn't improved over starter)
 * Score = 100 when current matched === total (every target declaration is correctly applied)
 * Score < 0   when current matched < baseline matched (regression)
 *
 * Capped to [-100, 100].
 */
export function progressScore(current: DeclStats, baseline: DeclStats): number {
  const real = current.total - baseline.matched;
  if (real <= 0) return current.matched >= current.total ? 100 : 0;
  const raw = ((current.matched - baseline.matched) / real) * 100;
  return Math.max(-100, Math.min(100, Math.round(raw)));
}
