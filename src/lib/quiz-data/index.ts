import type { Card, Pillar, TopicId } from '../types';
import { CSS_QUIZ_CARDS } from './css';
import { JS_QUIZ_CARDS } from './js';

export const ALL_CARDS: Card[] = [...CSS_QUIZ_CARDS, ...JS_QUIZ_CARDS];

export function getCardsByPillar(pillar: Pillar): Card[] {
  return pillar === 'css' ? CSS_QUIZ_CARDS : JS_QUIZ_CARDS;
}

const CARD_INDEX = new Map(ALL_CARDS.map((c) => [c.id, c]));

export function getCard(id: string): Card | undefined {
  return CARD_INDEX.get(id);
}

export function getCardsByTopic(topic: TopicId): Card[] {
  return ALL_CARDS.filter((c) => c.topic === topic);
}

export function getAllCardIds(): string[] {
  return ALL_CARDS.map((c) => c.id);
}

/** Shuffle a copy of the array deterministically by Math.random. */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
