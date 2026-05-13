'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Target, Trash2, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useProgressStore } from '@/lib/progress-store';
import type { WeeklyGoal } from '@/lib/types';

/**
 * Weekly SMART goals — deliberately NO streak counter.
 *
 * Carlos opted explicitly for goals over streaks ("ne casse pas ton J+24" =
 * anxiogenic). This component never shows consecutive-day counts.
 */
export function WeeklyGoals() {
  const t = useTranslations('dashboard');
  const tGoals = useTranslations('goals');
  const setGoals = useProgressStore((s) => s.setGoalsForCurrentWeek);
  const abandonGoal = useProgressStore((s) => s.abandonGoal);
  const goals = useProgressStore((s) => s.goals);

  // Avoid SSR hydration mismatches: Zustand-persist rehydrates on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentWeekGoals = useMemo<WeeklyGoal[]>(() => {
    if (!mounted) return [];
    return useProgressStore.getState().currentGoals();
  }, [mounted, goals]);

  const proposeDefaults = () => {
    setGoals([
      {
        kind: 'cards',
        description: tGoals('cards.label', { count: 25 }),
        target: 25,
      },
      {
        kind: 'levels',
        description: tGoals('levels.label', { count: 3 }),
        target: 3,
      },
      {
        kind: 'session-count',
        description: tGoals('sessionCount.label', { count: 4 }),
        target: 4,
      },
    ]);
  };

  if (!mounted) {
    return (
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-white/5" />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-400">
          <Target size={12} />
          {t('thisWeek')}
        </h3>
      </div>

      {currentWeekGoals.length === 0 ? (
        <div>
          <p className="mb-3 text-sm text-slate-400">{t('noGoals')}</p>
          <p className="mb-4 text-xs text-slate-500">{t('goalsHint')}</p>
          <button
            onClick={proposeDefaults}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-3 py-2 text-sm text-indigo-200 ring-1 ring-indigo-400/30 transition hover:bg-indigo-500/30"
          >
            <Plus size={14} />
            {t('setGoals')}
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence>
            {currentWeekGoals.map((g) => (
              <motion.li
                key={g.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span
                    className={`text-sm ${
                      g.state === 'completed'
                        ? 'text-emerald-200'
                        : g.state === 'abandoned'
                          ? 'text-slate-500 line-through'
                          : 'text-slate-200'
                    }`}
                  >
                    {g.description}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tabular-nums text-slate-500">
                      {g.kind === 'topic-mastery'
                        ? `${Math.round(g.progress * 100)}/${Math.round(g.target * 100)}`
                        : `${g.progress}/${g.target}`}
                    </span>
                    {g.state === 'completed' && (
                      <Check size={14} className="text-emerald-400" />
                    )}
                    {g.state === 'active' && (
                      <button
                        onClick={() => abandonGoal(g.id)}
                        className="text-slate-600 hover:text-rose-400"
                        title={t('abandon')}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={`h-full ${
                      g.state === 'completed'
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-indigo-400 to-fuchsia-400'
                    }`}
                    initial={false}
                    animate={{
                      width: `${Math.min(
                        100,
                        g.kind === 'topic-mastery'
                          ? (g.progress / g.target) * 100
                          : (g.progress / g.target) * 100
                      )}%`,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
