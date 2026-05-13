/**
 * Leitner-box spaced repetition.
 *
 * Boxes 1..5 with these review intervals:
 *   1 → 1 day
 *   2 → 2 days
 *   3 → 4 days
 *   4 → 7 days
 *   5 → 14 days
 *
 * Correct → next box (capped at 5). Incorrect → back to box 1.
 *
 * Chosen over SM-2/FSRS because: (a) volumes are small (~100-200 cards), (b)
 * transparency matters — Carlos should understand where his card lives, (c)
 * no need for grade granularity beyond correct/incorrect for vocabulary-style
 * recall.
 */

import type { CardProgress, LeitnerBox } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export const BOX_INTERVALS_DAYS: Record<LeitnerBox, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

export function initialCardProgress(now: number = Date.now()): CardProgress {
  return {
    box: 1,
    nextDueAt: now,
    lastReviewedAt: now,
    correctStreak: 0,
    reviews: 0,
    correct: 0,
  };
}

export function applyReview(
  current: CardProgress | undefined,
  correct: boolean,
  now: number = Date.now()
): CardProgress {
  const base = current ?? initialCardProgress(now);
  let nextBox: LeitnerBox;
  let nextStreak: number;
  if (correct) {
    nextBox = (Math.min(5, base.box + 1) as LeitnerBox);
    nextStreak = base.correctStreak + 1;
  } else {
    nextBox = 1;
    nextStreak = 0;
  }
  const intervalDays = BOX_INTERVALS_DAYS[nextBox];
  return {
    box: nextBox,
    nextDueAt: now + intervalDays * DAY_MS,
    lastReviewedAt: now,
    correctStreak: nextStreak,
    reviews: base.reviews + 1,
    correct: base.correct + (correct ? 1 : 0),
  };
}

/**
 * Filter card ids to those due for review at `now`. New cards (no progress
 * entry yet) are always considered due so they enter the rotation.
 */
export function dueCardIds(
  cards: Record<string, CardProgress>,
  allCardIds: string[],
  now: number = Date.now()
): string[] {
  return allCardIds.filter((id) => {
    const p = cards[id];
    if (!p) return true; // never seen → due
    return p.nextDueAt <= now;
  });
}

/** Count cards in each box for quick UI display. */
export function boxBreakdown(
  cards: Record<string, CardProgress>
): Record<LeitnerBox, number> {
  const counts: Record<LeitnerBox, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const p of Object.values(cards)) counts[p.box]++;
  return counts;
}
