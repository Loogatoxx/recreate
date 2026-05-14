'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Check, Copy, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { DeclStats } from '@/lib/visual-diff';
import { findDeclValue } from '@/lib/find-css-context';
import { useGameStore } from '@/lib/store';

type Props = {
  stats: DeclStats | null;
  targetCss: string;
  onSelectorHover: (selector: string | null) => void;
};

const REVEAL_COST = 40;

function category(prop: string): { emoji: string; tint: string } {
  if (/^(display|position|flex|justify|align|grid|gap|order|float|clear)/i.test(prop))
    return { emoji: '📐', tint: 'text-emerald-300' };
  if (/^(padding|margin|width|height|top|right|bottom|left|inset)/i.test(prop))
    return { emoji: '📏', tint: 'text-cyan-300' };
  if (/^(background|color|fill|stroke|opacity)/i.test(prop))
    return { emoji: '🎨', tint: 'text-fuchsia-300' };
  if (/^(border|outline|box-shadow)/i.test(prop))
    return { emoji: '⬛', tint: 'text-amber-300' };
  if (/^(font|text|letter|line|word|white-space)/i.test(prop))
    return { emoji: '✍️', tint: 'text-indigo-300' };
  if (/^(transform|transition|animation|filter)/i.test(prop))
    return { emoji: '✨', tint: 'text-rose-300' };
  return { emoji: '•', tint: 'text-slate-300' };
}

export function DiffPanel({ stats, targetCss, onSelectorHover }: Props) {
  const t = useTranslations('diff');
  const points = useGameStore((s) => s.points);
  const spendPoints = useGameStore((s) => s.spendPoints);

  // (selector + property) → revealed value, persisted only for the lifetime of the panel.
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    if (!stats) return new Map<string, string[]>();
    const map = new Map<string, string[]>();
    for (const item of stats.unmatched) {
      if (!map.has(item.selector)) map.set(item.selector, []);
      map.get(item.selector)!.push(item.property);
    }
    return map;
  }, [stats]);

  const revealKey = (selector: string, property: string) => `${selector}|${property}`;

  const handleReveal = (selector: string, property: string) => {
    const key = revealKey(selector, property);
    if (revealed[key]) return;
    if (points < REVEAL_COST) {
      setError(t('notEnoughPoints'));
      setTimeout(() => setError(null), 2000);
      return;
    }
    const value = findDeclValue(targetCss, selector, property);
    if (!value) {
      setError(t('revealNotFound'));
      setTimeout(() => setError(null), 2000);
      return;
    }
    if (!spendPoints(REVEAL_COST)) {
      setError(t('notEnoughPoints'));
      setTimeout(() => setError(null), 2000);
      return;
    }
    setRevealed((r) => ({ ...r, [key]: value }));
  };

  const handleCopy = async (key: string, declaration: string) => {
    try {
      await navigator.clipboard.writeText(declaration);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1200);
    } catch {
      // clipboard denied — silent fail
    }
  };

  if (!stats) {
    return <div className="p-4 text-xs text-slate-500">{t('computing')}</div>;
  }

  if (stats.unmatched.length === 0 && stats.total > 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <CheckCircle2 size={28} className="text-emerald-400" />
        <div>
          <div className="font-semibold text-emerald-200">{t('allMatch')}</div>
          <p className="mt-1 text-xs text-slate-400">{t('allMatchHint')}</p>
        </div>
      </div>
    );
  }

  const pct = stats.total > 0 ? Math.round((stats.matched / stats.total) * 100) : 0;

  return (
    <div className="relative flex h-full flex-col bg-slate-950">
      <div className="border-b border-white/5 px-3 py-3">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">{t('title')}</h3>
          <span className="font-mono text-[10px] text-slate-500">
            {stats.matched}/{stats.total}
          </span>
        </div>
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          />
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">{t('hover')}</p>
      </div>

      <div className="flex-1 overflow-auto px-3 py-3">
        <div className="space-y-3">
          {Array.from(grouped.entries()).map(([selector, props]) => (
            <div
              key={selector}
              onMouseEnter={() => onSelectorHover(selector)}
              onMouseLeave={() => onSelectorHover(null)}
            >
              <div className="mb-1 px-1 font-mono text-[10px] uppercase tracking-wider text-indigo-300">
                {selector}
              </div>
              <div className="space-y-0.5">
                {props.map((prop) => {
                  const cat = category(prop);
                  const key = revealKey(selector, prop);
                  const value = revealed[key];
                  const declaration = value ? `${prop}: ${value};` : '';
                  return (
                    <div
                      key={prop}
                      className="group rounded-md bg-white/[0.02] transition hover:bg-white/[0.05]"
                    >
                      <div className="flex w-full items-center gap-2 px-2.5 py-1.5">
                        <span className="text-xs">{cat.emoji}</span>
                        <code className={`flex-1 font-mono text-xs ${cat.tint}`}>{prop}</code>
                        {value ? (
                          <button
                            onClick={() => handleCopy(key, declaration)}
                            className="flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300 transition hover:bg-emerald-500/20"
                            title={t('copyDeclaration')}
                          >
                            {copied === key ? <Check size={10} /> : <Copy size={10} />}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReveal(selector, prop)}
                            disabled={points < REVEAL_COST}
                            className="flex items-center gap-1 rounded border border-fuchsia-500/40 bg-fuchsia-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-fuchsia-200 transition hover:bg-fuchsia-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            title={t('revealTooltip')}
                          >
                            <Eye size={10} />
                            <span className="font-mono">-{REVEAL_COST}</span>
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {value && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden border-t border-emerald-500/10 px-2.5"
                          >
                            <code className="block py-1.5 font-mono text-[11px] text-emerald-200">
                              {declaration}
                            </code>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs text-rose-200 shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
