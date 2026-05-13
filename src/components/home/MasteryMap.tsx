'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useProgressStore } from '@/lib/progress-store';
import { CSS_TOPICS } from '@/lib/topics';

/** Heatmap of topic mastery — green ≥ 0.8, amber ≥ 0.5, rose < 0.5, empty = no data yet. */
export function MasteryMap() {
  const t = useTranslations();
  const tDashboard = useTranslations('dashboard');
  const mastery = useProgressStore((s) => s.topicMastery);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-white/5" />
      </section>
    );
  }

  const knownCount = CSS_TOPICS.filter((tp) => mastery[tp.id] != null).length;

  return (
    <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400">
          {tDashboard('mastery')}
        </h3>
        <Link href="/quiz" className="text-xs text-indigo-300 hover:text-indigo-200">
          {tDashboard('viewQuiz')} →
        </Link>
      </div>

      {knownCount === 0 ? (
        <p className="text-sm text-slate-500">{tDashboard('noMasteryYet')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {CSS_TOPICS.map((tp) => {
            const m = mastery[tp.id];
            const score = m ? Math.round(m.score * 100) : null;
            const cls =
              score == null
                ? 'border-white/5 bg-white/[0.02] text-slate-600'
                : score >= 80
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : score >= 50
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-200';
            const label = safeT(t, `topics.${tp.id}`, tp.fallbackLabel);
            return (
              <Link
                key={tp.id}
                href={`/quiz/session?source=topic&topic=${encodeURIComponent(tp.id)}`}
                className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 text-[11px] transition hover:brightness-125 ${cls}`}
              >
                <span className="truncate pr-1">{label}</span>
                <span className="font-mono text-[10px] tabular-nums">
                  {score == null ? '—' : `${score}%`}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function safeT(t: ReturnType<typeof useTranslations>, key: string, fallback: string): string {
  try {
    return (t as unknown as (k: string) => string)(key) || fallback;
  } catch {
    return fallback;
  }
}
