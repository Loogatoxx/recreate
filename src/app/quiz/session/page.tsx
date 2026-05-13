'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { QuizSession } from '@/components/quiz/QuizSession';
import { ALL_CARDS, getCardsByTopic, shuffle, getAllCardIds } from '@/lib/quiz-data';
import { useProgressStore } from '@/lib/progress-store';
import { dueCardIds } from '@/lib/srs';
import { getTopic } from '@/lib/topics';
import type { Card } from '@/lib/types';

const SESSION_SIZE = 10;

export default function QuizSessionPage() {
  const params = useSearchParams();
  const source = params.get('source') ?? 'all';
  const topicId = params.get('topic') ?? '';
  const cardsProgress = useProgressStore((s) => s.cards);
  const t = useTranslations();

  // Defer card selection to a layout effect so it stabilises after hydration.
  const [cards, setCards] = useState<Card[]>([]);
  const [label, setLabel] = useState('');

  useEffect(() => {
    let pool: Card[] = [];
    let resolvedLabel = '';

    if (source === 'topic' && topicId) {
      pool = getCardsByTopic(topicId);
      const topic = getTopic(topicId);
      resolvedLabel = safeT(
        t,
        `topics.${topicId}`,
        topic?.fallbackLabel ?? topicId
      );
    } else if (source === 'due') {
      const dueIds = new Set(dueCardIds(cardsProgress, getAllCardIds()));
      pool = ALL_CARDS.filter((c) => dueIds.has(c.id));
      resolvedLabel = safeT(t, 'quiz.dueSession', 'Due cards');
    } else {
      pool = ALL_CARDS;
      resolvedLabel = safeT(t, 'quiz.mixedSession', 'Mixed');
    }

    setCards(shuffle(pool).slice(0, SESSION_SIZE));
    setLabel(resolvedLabel);
    // Lock the session contents on first mount per search-param change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, topicId]);

  const total = useMemo(() => cards.length, [cards]);
  if (total === 0 && source !== 'all' && cards !== ALL_CARDS) {
    // Show skeleton briefly while computing
  }

  return <QuizSession cards={cards} source={label} />;
}

function safeT(t: ReturnType<typeof useTranslations>, key: string, fallback: string): string {
  try {
    return (t as unknown as (k: string) => string)(key) || fallback;
  } catch {
    return fallback;
  }
}
