/**
 * Central type definitions for cross-session persistence (progress, SRS, goals).
 *
 * In-session game state (score, combo, hints) lives in `store.ts` and is intentionally
 * NOT persisted — it resets every level.
 */

// ---------- Topics ----------

export type TopicId = string;

export type Topic = {
  id: TopicId;
  /** Surface name; localised via the `topics` namespace in messages. Fallback used if no translation. */
  fallbackLabel: string;
  /** Pillar this topic belongs to. */
  pillar: 'css' | 'js';
  /** Optional sub-category for grouping in UI (e.g. 'flexbox' under css). */
  group?: string;
};

// ---------- Levels ----------

export type LevelProgress = {
  /** Best matchRatio reached, 0-100. */
  bestScore: number;
  /** Best completion time in ms, null if never completed. */
  bestTimeMs: number | null;
  attempts: number;
  /** First time the user hit 100% on this level. */
  completedAt: number | null;
  lastPlayedAt: number;
  /** Topic IDs touched by this level (drives mastery updates). */
  topics: TopicId[];
};

// ---------- Quiz cards ----------

export type CardKind = 'mcq' | 'fill-blank' | 'predict-output';

export type McqOption = {
  id: string;
  label: string;
  /**
   * If present, the UI looks up this i18n key and shows the translated string.
   * Use for textual options (full sentences) that need translation. Pure-code
   * options like `display: flex` should be left without a key.
   */
  i18nKey?: string;
  /** Optional code snippet shown under the label. */
  code?: string;
};

export type Card = {
  id: string;
  kind: CardKind;
  topic: TopicId;
  /** Localisation key for the prompt under the `quiz.cards` namespace. */
  promptKey: string;
  /** Optional code shown as context (rendered with syntax highlighting). */
  context?: string;
  /** Only for MCQ. */
  options?: McqOption[];
  /** ID of the correct option for MCQ, or array of acceptable strings for fill-blank. */
  answer: string | string[];
  /** Optional localisation key for the explanation shown after answering. */
  explanationKey?: string;
};

/** Leitner box, 1 (daily) → 5 (every 2 weeks). */
export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export type CardProgress = {
  box: LeitnerBox;
  /** Epoch ms when this card is next due for review. */
  nextDueAt: number;
  lastReviewedAt: number;
  /** Consecutive correct answers (across reviews). */
  correctStreak: number;
  /** Total times reviewed (correct + incorrect). */
  reviews: number;
  /** Total times answered correctly. */
  correct: number;
};

// ---------- Topic mastery ----------

export type TopicMastery = {
  /** EMA score 0..1 of recent attempts on this topic. */
  score: number;
  attempts: number;
  lastAttemptAt: number;
};

// ---------- Weekly SMART goals ----------

export type GoalKind = 'levels' | 'cards' | 'topic-mastery' | 'session-count';

export type GoalState = 'active' | 'completed' | 'abandoned';

export type WeeklyGoal = {
  id: string;
  /** Epoch ms of Monday 00:00 (local time) of the week this goal belongs to. */
  weekStart: number;
  kind: GoalKind;
  /** Human-readable summary, localised via i18n. Stored verbatim for historical display. */
  description: string;
  /** Target value (e.g. 5 levels, 25 cards, 0.8 mastery). */
  target: number;
  /** Optional topic this goal is scoped to. */
  topic?: TopicId;
  /** Current progress toward target. */
  progress: number;
  state: GoalState;
  createdAt: number;
};

// ---------- WIP (work-in-progress) — auto-saved code per level ----------

export type Wip = {
  html: string;
  css: string;
  /** Epoch ms when last saved. */
  savedAt: number;
};

// ---------- Root persisted state ----------

export type Progress = {
  /** Bumped on breaking schema changes — migration handled in the store. */
  schemaVersion: 1;
  levels: Record<string, LevelProgress>;
  cards: Record<string, CardProgress>;
  goals: WeeklyGoal[];
  topicMastery: Record<TopicId, TopicMastery>;
  /** Track session-count goals — incremented when user starts any practice action that day. */
  sessionsByDay: Record<string, number>; // key = YYYY-MM-DD
  /** Per-level work-in-progress code, auto-saved as the user edits. */
  wip: Record<string, Wip>;
};

export const INITIAL_PROGRESS: Progress = {
  schemaVersion: 1,
  levels: {},
  cards: {},
  goals: [],
  topicMastery: {},
  sessionsByDay: {},
  wip: {},
};
