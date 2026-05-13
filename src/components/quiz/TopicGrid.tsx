'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useProgressStore } from '@/lib/progress-store';

type TopicCardData = {
  id: string;
  fallbackLabel: string;
  cardCount: number;
};

type Group = {
  group: string;
  pillar?: 'css' | 'js';
  topics: TopicCardData[];
};

type Props = {
  groups: Group[];
};

export function TopicGrid({ groups }: Props) {
  const t = useTranslations();
  const mastery = useProgressStore((s) => s.topicMastery);

  return (
    <div className="space-y-6">
      {groups.map(({ group, pillar, topics }) => (
        <div key={`${pillar ?? 'css'}-${group}`}>
          <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {safeT(t, `topicGroups.${pillar ?? 'css'}.${group}`, group)}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {topics.map((tp) => {
              const m = mastery[tp.id];
              const score = m ? Math.round(m.score * 100) : null;
              return (
                <Link
                  key={tp.id}
                  href={`/quiz/session?source=topic&topic=${encodeURIComponent(tp.id)}`}
                  className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 transition hover:border-indigo-500/40 hover:bg-white/[0.06]"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-100">
                      {safeT(t, `topics.${tp.id}`, tp.fallbackLabel)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {tp.cardCount} {t('quiz.cardsLabel')}
                    </div>
                  </div>
                  <MasteryDot score={score} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function MasteryDot({ score }: { score: number | null }) {
  if (score == null) {
    return (
      <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-500">
        —
      </span>
    );
  }
  const color =
    score >= 80
      ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/40'
      : score >= 50
        ? 'bg-amber-500/20 text-amber-200 ring-amber-400/40'
        : 'bg-rose-500/20 text-rose-200 ring-rose-400/40';
  return (
    <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ring-1 ${color}`}>
      {score}%
    </span>
  );
}

function safeT(t: ReturnType<typeof useTranslations>, key: string, fallback: string): string {
  try {
    return (t as unknown as (k: string) => string)(key) || fallback;
  } catch {
    return fallback;
  }
}
