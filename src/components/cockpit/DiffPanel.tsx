'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { DeclStats } from '@/lib/visual-diff';

type Props = {
  stats: DeclStats | null;
  onSelectorHover: (selector: string | null) => void;
};

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

export function DiffPanel({ stats, onSelectorHover }: Props) {
  const t = useTranslations('diff');

  const grouped = useMemo(() => {
    if (!stats) return new Map<string, string[]>();
    const map = new Map<string, string[]>();
    for (const item of stats.unmatched) {
      if (!map.has(item.selector)) map.set(item.selector, []);
      map.get(item.selector)!.push(item.property);
    }
    return map;
  }, [stats]);

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
    <div className="flex h-full flex-col bg-slate-950">
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
                  return (
                    <div
                      key={prop}
                      className="flex w-full items-center gap-2 rounded-md bg-white/[0.02] px-2.5 py-1.5 transition hover:bg-white/[0.05]"
                    >
                      <span className="text-xs">{cat.emoji}</span>
                      <code className={`flex-1 font-mono text-xs ${cat.tint}`}>{prop}</code>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
