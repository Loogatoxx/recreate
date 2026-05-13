const VOID_TAGS = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
const INDENT = '  ';

export function formatHtml(html: string): string {
  if (!html.trim()) return html;

  const cleaned = html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();

  const tokens = cleaned.match(/<\/?[^>]+>|[^<]+/g);
  if (!tokens) return cleaned;

  const lines: string[] = [];
  let depth = 0;

  for (const tok of tokens) {
    const isTag = tok.startsWith('<');

    if (!isTag) {
      // text content — append to previous line if it ended with an opening tag
      const text = tok;
      const last = lines[lines.length - 1];
      if (last && /<[^/!][^>]*>$/.test(last)) {
        lines[lines.length - 1] = last + text;
      } else {
        lines.push(INDENT.repeat(depth) + text);
      }
      continue;
    }

    const isClosing = tok.startsWith('</');
    const isSelfClose = tok.endsWith('/>');
    const tagName = tok.match(/^<\/?([\w-]+)/)?.[1] ?? '';
    const isVoid = VOID_TAGS.test(tagName);

    if (isClosing) {
      depth = Math.max(0, depth - 1);
      const last = lines[lines.length - 1] ?? '';
      // Keep on same line if it's <tag>text</tag>
      const inlineOpenRe = new RegExp(`<${tagName}[^>]*>[^<>]+$`);
      if (inlineOpenRe.test(last)) {
        lines[lines.length - 1] = last + tok;
      } else {
        lines.push(INDENT.repeat(depth) + tok);
      }
    } else {
      lines.push(INDENT.repeat(depth) + tok);
      if (!isSelfClose && !isVoid) depth++;
    }
  }

  return lines.join('\n').trim();
}

export function formatCss(css: string): string {
  if (!css.trim()) return css;

  const cleaned = css.replace(/\s+/g, ' ').trim();

  const lines: string[] = [];
  let depth = 0;
  let buffer = '';

  const flushDecl = () => {
    const trimmed = buffer.trim();
    if (trimmed) lines.push(INDENT.repeat(depth) + trimmed);
    buffer = '';
  };

  for (let i = 0; i < cleaned.length; i++) {
    const c = cleaned[i];

    if (c === '{') {
      const selector = buffer.trim();
      if (selector) lines.push(INDENT.repeat(depth) + selector + ' {');
      else lines.push(INDENT.repeat(depth) + '{');
      buffer = '';
      depth++;
    } else if (c === '}') {
      flushDecl();
      depth = Math.max(0, depth - 1);
      lines.push(INDENT.repeat(depth) + '}');
      // blank line between top-level rules
      if (depth === 0) lines.push('');
    } else if (c === ';') {
      lines.push(INDENT.repeat(depth) + (buffer.trim() + ';'));
      buffer = '';
    } else {
      buffer += c;
    }
  }

  if (buffer.trim()) flushDecl();
  // trim trailing blanks
  while (lines.length && !lines[lines.length - 1]) lines.pop();

  return lines.join('\n');
}
