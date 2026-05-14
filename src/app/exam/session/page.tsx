'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { QuizSession } from '@/components/quiz/QuizSession';
import { getCardsByPillar, shuffle } from '@/lib/quiz-data';
import { useProgressStore } from '@/lib/progress-store';
import type { Card, Pillar } from '@/lib/types';

const EXAM_SIZE = 20;

export default function ExamSessionPage() {
  const params = useSearchParams();
  const raw = params.get('pillar');
  const pillar: Pillar | null = raw === 'css' || raw === 'js' ? raw : null;

  const t = useTranslations();
  const recordExamAttempt = useProgressStore((s) => s.recordExamAttempt);

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!pillar) return;
    const pool = getCardsByPillar(pillar);
    setCards(shuffle(pool).slice(0, EXAM_SIZE));
  }, [pillar]);

  const onCompleteRef = useRef(false);
  const handleComplete = ({ correct, total }: { correct: number; total: number }) => {
    if (onCompleteRef.current || !pillar) return;
    onCompleteRef.current = true;
    const score = total > 0 ? Math.round((100 * correct) / total) : 0;
    recordExamAttempt(pillar, score);
  };

  if (!pillar) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="text-slate-300">{safeT(t, 'exam.pickPillar', 'Pick a pillar')}</p>
        <Link
          href="/exam"
          className="mt-4 inline-block rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          {safeT(t, 'exam.backToExam', 'Back to exam')}
        </Link>
      </div>
    );
  }

  return (
    <QuizSession
      cards={cards}
      source={safeT(t, 'exam.pillarLabel', `Exam — ${pillar.toUpperCase()}`, {
        pillar: pillar.toUpperCase(),
      })}
      mode="exam"
      backHref="/exam"
      onComplete={handleComplete}
    />
  );
}

function safeT(
  t: ReturnType<typeof useTranslations>,
  key: string,
  fallback: string,
  values?: Record<string, string | number>
): string {
  try {
    const fn = t as unknown as (k: string, v?: Record<string, string | number>) => string;
    return fn(key, values) || fallback;
  } catch {
    return fallback;
  }
}
