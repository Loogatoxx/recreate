'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Card } from '@/lib/types';
import { useProgressStore } from '@/lib/progress-store';
import { CardView } from './CardView';

type Props = {
  cards: Card[];
  /** Label of the source (topic name, "due cards", etc) — shown in the header. */
  source: string;
};

export function QuizSession({ cards, source }: Props) {
  const t = useTranslations();
  const reviewCard = useProgressStore((s) => s.reviewCard);
  const recordSession = useProgressStore((s) => s.recordSession);
  const bumpTopicMastery = useProgressStore((s) => s.bumpTopicMastery);

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  useEffect(() => {
    recordSession();
  }, [recordSession]);

  const current = cards[index];
  const done = index >= cards.length;

  const onAnswered = (correct: boolean) => {
    if (!current) return;
    reviewCard(current.id, correct);
    bumpTopicMastery(current.topic, correct ? 1 : 0);
    setResults((r) => ({
      correct: r.correct + (correct ? 1 : 0),
      total: r.total + 1,
    }));
    setIndex((i) => i + 1);
  };

  const accuracy = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0;
  const progressPct = useMemo(
    () => (cards.length > 0 ? Math.round((index / cards.length) * 100) : 0),
    [index, cards.length]
  );

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="text-slate-300">{t('quiz.noCards')}</p>
        <Link
          href="/quiz"
          className="mt-4 inline-block rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          {t('quiz.pickTopic')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col px-6 py-6">
      <header className="mb-4 flex items-center justify-between">
        <Link
          href="/quiz"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-100"
        >
          <ArrowLeft size={14} />
          {t('quiz.backToTopics')}
        </Link>
        <span className="font-mono text-xs text-slate-400">{source}</span>
        <span className="font-mono text-xs text-slate-500">
          {Math.min(index + 1, cards.length)} / {cards.length}
        </span>
      </header>

      <div className="mb-6 h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-400 to-emerald-400"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {!done && current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <CardView card={current} onAnswered={onAnswered} />
            </motion.div>
          )}

          {done && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col items-center justify-center gap-6"
            >
              <Sparkles size={40} className="text-amber-300" />
              <h2 className="text-2xl font-bold text-white">{t('quiz.sessionDone')}</h2>
              <div className="text-center">
                <div className="font-mono text-5xl font-extrabold text-amber-300 tabular-nums">
                  {accuracy}%
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  {results.correct} / {results.total} {t('quiz.correctLow')}
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/quiz"
                  className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                >
                  {t('quiz.backToTopics')}
                </Link>
                <Link
                  href="/"
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-fuchsia-400"
                >
                  {t('victory.menu')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
