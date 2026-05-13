'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

type EntrySlug =
  // layout (flex)
  | 'displayFlex'
  | 'flexDirection'
  | 'justifyContent'
  | 'alignItems'
  | 'gap'
  | 'displayGrid'
  // spacing
  | 'padding'
  | 'margin'
  | 'marginAuto'
  // colors & backgrounds
  | 'background'
  | 'color'
  | 'opacity'
  // borders & shadows
  | 'borderRadius'
  | 'border'
  | 'boxShadow'
  // typography
  | 'fontSize'
  | 'fontWeight'
  | 'textAlign'
  // dimensions
  | 'widthHeight'
  // selectors (Pestana §"Tipos de seletores")
  | 'selectorClass'
  | 'selectorId'
  | 'selectorUniversal'
  | 'combinatorDescendant'
  | 'combinatorChild'
  | 'combinatorAdjacent'
  | 'combinatorSibling'
  | 'attrSelector'
  | 'pseudoHover'
  | 'pseudoFirstChild'
  | 'pseudoNthChild'
  | 'pseudoFirstLetter'
  | 'pseudoBefore'
  | 'specificity'
  // positioning (Pestana §"Posicionamento")
  | 'positionStatic'
  | 'positionRelative'
  | 'positionAbsolute'
  | 'positionFixed'
  | 'zIndex'
  | 'floatLeft'
  | 'clearBoth'
  // display details
  | 'displayBlock'
  | 'displayNone'
  | 'visibilityHidden'
  // animation
  | 'transition'
  | 'transitionTiming'
  | 'keyframes'
  // adaptive
  | 'mediaQuery'
  | 'viewport'
  // variables
  | 'cssVar';

type Entry = {
  slug: EntrySlug;
  name: string; // code-like, untranslated
  example: string;
  hasValues?: boolean;
};

type SectionKey =
  | 'selectors'
  | 'layout'
  | 'spacing'
  | 'positioning'
  | 'colors'
  | 'borders'
  | 'typography'
  | 'dimensions'
  | 'animation'
  | 'adaptive'
  | 'cssVariables';

type Section = {
  key: SectionKey;
  emoji: string;
  color: string;
  entries: Entry[];
};

const MANUAL: Section[] = [
  {
    key: 'selectors',
    emoji: '🎯',
    color: 'from-indigo-500/20 to-indigo-500/5 ring-indigo-400/30',
    entries: [
      { slug: 'selectorClass', name: '.class', example: '.button { color: blue; }' },
      { slug: 'selectorId', name: '#id', example: '#header { padding: 16px; }' },
      { slug: 'selectorUniversal', name: '*', example: '* { box-sizing: border-box; }' },
      { slug: 'combinatorDescendant', name: 'A B (descendant)', example: 'table td p { font-weight: bold; }' },
      { slug: 'combinatorChild', name: 'A > B (child)', example: 'ul > li { padding: 4px; }' },
      { slug: 'combinatorAdjacent', name: 'A + B (adjacent)', example: 'h1 + p { color: red; }' },
      { slug: 'combinatorSibling', name: 'A ~ B (sibling)', example: 'h1 ~ p { color: gray; }' },
      {
        slug: 'attrSelector',
        name: '[attr], [attr=val], [attr^=...]',
        hasValues: true,
        example: 'input[type="text"] { }\nimg[alt^="Figura"] { }\nimg[alt$=".png"] { }',
      },
      { slug: 'pseudoHover', name: ':hover', example: 'a:hover { color: blue; }' },
      { slug: 'pseudoFirstChild', name: ':first-child', example: 'p:first-child { font-size: 20px; }' },
      {
        slug: 'pseudoNthChild',
        name: ':nth-child(N)',
        hasValues: true,
        example: 'li:nth-child(2n) { background: #f5f5f5; }\nli:nth-child(odd) { ... }',
      },
      { slug: 'pseudoFirstLetter', name: '::first-letter', example: 'p::first-letter { font-size: 40px; }' },
      { slug: 'pseudoBefore', name: '::before / ::after', example: '.quote::before { content: "«"; }' },
      { slug: 'specificity', name: 'Spécificité', example: '/* id (100) > class (10) > tag (1) */' },
    ],
  },
  {
    key: 'layout',
    emoji: '📐',
    color: 'from-emerald-500/20 to-emerald-500/5 ring-emerald-400/30',
    entries: [
      { slug: 'displayFlex', name: 'display: flex', example: '.parent {\n  display: flex;\n}' },
      {
        slug: 'flexDirection', name: 'flex-direction', hasValues: true,
        example: '.parent {\n  display: flex;\n  flex-direction: column;\n}',
      },
      {
        slug: 'justifyContent', name: 'justify-content', hasValues: true,
        example: '.parent {\n  display: flex;\n  justify-content: center;\n}',
      },
      {
        slug: 'alignItems', name: 'align-items', hasValues: true,
        example: '.parent {\n  display: flex;\n  align-items: center;\n}',
      },
      { slug: 'gap', name: 'gap', example: '.parent {\n  display: flex;\n  gap: 12px;\n}' },
      {
        slug: 'displayGrid', name: 'display: grid',
        example: '.parent {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}',
      },
      { slug: 'displayBlock', name: 'display: block / inline / inline-block', hasValues: true,
        example: 'div { display: block; }\nspan { display: inline; }' },
      { slug: 'displayNone', name: 'display: none', example: '.hidden { display: none; }' },
      { slug: 'visibilityHidden', name: 'visibility: hidden', example: '.invisible { visibility: hidden; }' },
    ],
  },
  {
    key: 'positioning',
    emoji: '📌',
    color: 'from-fuchsia-500/20 to-fuchsia-500/5 ring-fuchsia-400/30',
    entries: [
      { slug: 'positionStatic', name: 'position: static', example: '.box { position: static; /* default */ }' },
      {
        slug: 'positionRelative', name: 'position: relative',
        example: '.parent {\n  position: relative;\n}\n.child {\n  position: absolute;\n  top: 0;\n}',
      },
      {
        slug: 'positionAbsolute', name: 'position: absolute',
        example: '.tag {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}',
      },
      { slug: 'positionFixed', name: 'position: fixed', example: '.header {\n  position: fixed;\n  top: 0;\n}' },
      { slug: 'zIndex', name: 'z-index', example: '.modal {\n  position: fixed;\n  z-index: 100;\n}' },
      { slug: 'floatLeft', name: 'float: left / right', example: 'img.thumb { float: left; margin-right: 12px; }' },
      { slug: 'clearBoth', name: 'clear: left / right / both', example: '.below { clear: both; }' },
    ],
  },
  {
    key: 'spacing',
    emoji: '📏',
    color: 'from-cyan-500/20 to-cyan-500/5 ring-cyan-400/30',
    entries: [
      { slug: 'padding', name: 'padding', hasValues: true, example: '.box {\n  padding: 16px 24px;\n}' },
      { slug: 'margin', name: 'margin', example: '.box {\n  margin: 16px;\n}' },
      { slug: 'marginAuto', name: 'margin: 0 auto (centrage)', example: '.centered {\n  width: 600px;\n  margin: 0 auto;\n}' },
    ],
  },
  {
    key: 'colors',
    emoji: '🎨',
    color: 'from-fuchsia-500/20 to-fuchsia-500/5 ring-fuchsia-400/30',
    entries: [
      {
        slug: 'background', name: 'background',
        example: '.box {\n  background: #8b5cf6;\n}\n\n.fancy {\n  background: linear-gradient(135deg, #6366f1, #ec4899);\n}',
      },
      { slug: 'color', name: 'color', example: '.label {\n  color: #0f172a;\n}' },
      { slug: 'opacity', name: 'opacity', example: '.faded {\n  opacity: 0.5;\n}' },
    ],
  },
  {
    key: 'borders',
    emoji: '⬛',
    color: 'from-amber-500/20 to-amber-500/5 ring-amber-400/30',
    entries: [
      {
        slug: 'borderRadius', name: 'border-radius',
        example: '.box {\n  border-radius: 12px;\n}\n\n.avatar {\n  border-radius: 50%;\n}',
      },
      { slug: 'border', name: 'border', example: '.box {\n  border: 2px solid #6366f1;\n}' },
      {
        slug: 'boxShadow', name: 'box-shadow',
        example: '.card {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}',
      },
    ],
  },
  {
    key: 'typography',
    emoji: '✍️',
    color: 'from-indigo-500/20 to-indigo-500/5 ring-indigo-400/30',
    entries: [
      { slug: 'fontSize', name: 'font-size', example: '.title {\n  font-size: 24px;\n}' },
      { slug: 'fontWeight', name: 'font-weight', example: '.title {\n  font-weight: 700;\n}' },
      {
        slug: 'textAlign', name: 'text-align', hasValues: true,
        example: '.title {\n  text-align: center;\n}',
      },
    ],
  },
  {
    key: 'dimensions',
    emoji: '📦',
    color: 'from-rose-500/20 to-rose-500/5 ring-rose-400/30',
    entries: [
      {
        slug: 'widthHeight', name: 'width / height (+ min/max)',
        example: '.box {\n  width: 200px;\n  height: 100px;\n  max-width: 100%;\n}',
      },
    ],
  },
  {
    key: 'animation',
    emoji: '✨',
    color: 'from-rose-500/20 to-rose-500/5 ring-rose-400/30',
    entries: [
      {
        slug: 'transition', name: 'transition',
        example: '.btn {\n  background: blue;\n  transition: background 0.3s;\n}\n\n.btn:hover {\n  background: red;\n}',
      },
      {
        slug: 'transitionTiming', name: 'transition-timing-function', hasValues: true,
        example: '.btn {\n  transition: all 0.3s;\n  transition-timing-function: ease-in-out;\n}',
      },
      {
        slug: 'keyframes', name: '@keyframes',
        example: '@keyframes spin {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}\n\n.spinner {\n  animation: spin 1s linear infinite;\n}',
      },
    ],
  },
  {
    key: 'adaptive',
    emoji: '📱',
    color: 'from-emerald-500/20 to-emerald-500/5 ring-emerald-400/30',
    entries: [
      {
        slug: 'mediaQuery', name: '@media (max-width: ...)',
        example: '@media (max-width: 768px) {\n  .nav { display: none; }\n}\n\n@media screen and (orientation: landscape) {\n  /* ... */\n}',
      },
      {
        slug: 'viewport', name: '<meta viewport>',
        example: '<meta name="viewport"\n      content="width=device-width, initial-scale=1.0">',
      },
    ],
  },
  {
    key: 'cssVariables',
    emoji: '🔧',
    color: 'from-amber-500/20 to-amber-500/5 ring-amber-400/30',
    entries: [
      {
        slug: 'cssVar', name: ':root + var()',
        example: ':root {\n  --primary: #6366f1;\n}\n\n.button {\n  background: var(--primary);\n}',
      },
    ],
  },
];

export function ManualPanel() {
  const t = useTranslations('manual');
  const tSections = useTranslations('manual.sections');
  const tEntries = useTranslations('manual.entries');

  const [openSection, setOpenSection] = useState<SectionKey | null>(MANUAL[0].key);
  const [openEntry, setOpenEntry] = useState<EntrySlug | null>(null);

  const tr = useMemo(
    () => ({
      summary: (slug: EntrySlug) =>
        safeT(tEntries, `${slug}.summary`, ''),
      values: (slug: EntrySlug) =>
        safeT(tEntries, `${slug}.values`, ''),
    }),
    [tEntries]
  );

  return (
    <div className="h-full overflow-auto bg-slate-950 px-3 py-4">
      <div className="mb-3 px-1">
        <h3 className="text-sm font-bold text-slate-100">{t('title')}</h3>
        <p className="mt-1 text-xs text-slate-500">{t('intro')}</p>
      </div>

      <div className="flex flex-col gap-2">
        {MANUAL.map((section) => {
          const isOpen = openSection === section.key;
          return (
            <div
              key={section.key}
              className={`overflow-hidden rounded-lg bg-gradient-to-br ring-1 ${section.color}`}
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : section.key)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <span>{section.emoji}</span>
                  {safeT(tSections, section.key, section.key)}
                </span>
                <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
                  <ChevronRight size={14} className="text-slate-400" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="space-y-1 border-t border-white/5 bg-slate-950/40 p-2">
                      {section.entries.map((entry) => {
                        const isEntryOpen = openEntry === entry.slug;
                        return (
                          <div key={entry.slug} className="rounded-md bg-white/[0.02]">
                            <button
                              onClick={() =>
                                setOpenEntry(isEntryOpen ? null : entry.slug)
                              }
                              className="flex w-full items-center justify-between px-3 py-1.5 text-left"
                            >
                              <code className="font-mono text-xs text-indigo-300">{entry.name}</code>
                              <motion.span animate={{ rotate: isEntryOpen ? 90 : 0 }}>
                                <ChevronRight size={12} className="text-slate-500" />
                              </motion.span>
                            </button>
                            <AnimatePresence initial={false}>
                              {isEntryOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-2 px-3 pb-3 pt-1">
                                    <p className="text-xs leading-relaxed text-slate-300">
                                      {tr.summary(entry.slug)}
                                    </p>
                                    {entry.hasValues && tr.values(entry.slug) && (
                                      <p className="text-[11px] text-slate-400">
                                        <span className="text-slate-500">{t('values')} : </span>
                                        <span className="font-mono text-slate-300">
                                          {tr.values(entry.slug)}
                                        </span>
                                      </p>
                                    )}
                                    <pre className="overflow-x-auto rounded-md bg-slate-950 p-2 text-[11px] leading-relaxed text-slate-200 ring-1 ring-white/5">
                                      <code>{entry.example}</code>
                                    </pre>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function safeT(t: ReturnType<typeof useTranslations>, key: string, fallback: string): string {
  try {
    return (t as unknown as (k: string) => string)(key) || fallback;
  } catch {
    return fallback;
  }
}
