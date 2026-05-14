'use client';

import { useTranslations } from 'next-intl';
import { useProgressStore } from '@/lib/progress-store';
import type { ExamScore, Pillar } from '@/lib/types';

export function ExamHistory() {
  const t = useTranslations('exam');
  const examScores = useProgressStore((s) => s.examScores);

  return (
    <section className="mt-10">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
        {t('historyTitle')}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <PillarRow pillar="css" score={examScores?.css} t={t} accent="indigo" />
        <PillarRow pillar="js" score={examScores?.js} t={t} accent="amber" />
      </div>
    </section>
  );
}

type Accent = 'indigo' | 'amber';
type TFn = ReturnType<typeof useTranslations>;

function PillarRow({
  pillar,
  score,
  t,
  accent,
}: {
  pillar: Pillar;
  score: ExamScore | undefined;
  t: TFn;
  accent: Accent;
}) {
  const tagBg = accent === 'indigo' ? 'bg-indigo-500/20 text-indigo-200' : 'bg-amber-500/20 text-amber-200';

  if (!score || score.attempts === 0) {
    return (
      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
        <div className={`mb-2 inline-flex rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tagBg}`}>
          {pillar.toUpperCase()}
        </div>
        <p className="text-xs text-slate-500">{t('noAttempts')}</p>
      </div>
    );
  }

  const date = new Date(score.lastAttemptAt);
  const dateLabel = date.toLocaleDateString();

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className={`inline-flex rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tagBg}`}>
          {pillar.toUpperCase()}
        </div>
        {score.completedAt != null && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            100% ✓
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-3">
        <div>
          <div className="font-mono text-3xl font-extrabold text-amber-300 tabular-nums">
            {score.bestScore}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{t('bestScore')}</div>
        </div>
        <div>
          <div className="font-mono text-lg font-bold text-slate-300 tabular-nums">{score.lastScore}%</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{t('lastScore')}</div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        {t('attempts', { count: score.attempts })} · {dateLabel}
      </p>
    </div>
  );
}
