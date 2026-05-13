'use client';

import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useProgressStore } from '@/lib/progress-store';
import { dueCardIds } from '@/lib/srs';
import { getAllCardIds } from '@/lib/quiz-data';

export function QuizDueChip() {
  const t = useTranslations('quiz');
  const cards = useProgressStore((s) => s.cards);
  const due = dueCardIds(cards, getAllCardIds()).length;

  if (due === 0) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200">
        ✓ {t('noDueCards')}
      </div>
    );
  }

  return (
    <Link
      href="/quiz/session?source=due"
      className="group flex items-center justify-between gap-3 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 transition hover:border-indigo-400/60 hover:bg-indigo-500/15"
    >
      <div className="flex items-center gap-2.5">
        <Clock size={16} className="text-indigo-300" />
        <span className="text-sm text-indigo-100">
          {t('dueToday', { count: due })}
        </span>
      </div>
      <ChevronRight size={16} className="text-indigo-300 transition group-hover:translate-x-0.5" />
    </Link>
  );
}
