'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  INITIAL_PROGRESS,
  type CardProgress,
  type LevelProgress,
  type Progress,
  type TopicId,
  type WeeklyGoal,
  type GoalKind,
} from './types';
import { applyReview, initialCardProgress } from './srs';

const STORAGE_KEY = 'recreate:progress';
const STORAGE_VERSION = 1;
const MASTERY_EMA_ALPHA = 0.25;

function todayKey(d = new Date()): string {
  // YYYY-MM-DD in local time. Date keys are local because the user's "day" is local.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Monday 00:00 (local) of the week containing `d`. */
function weekStart(d = new Date()): number {
  const x = new Date(d);
  const day = x.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // days since Monday
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - diff);
  return x.getTime();
}

type ProgressActions = {
  // Levels
  recordLevelAttempt: (
    levelId: string,
    payload: { score: number; timeMs: number | null; topics: TopicId[] }
  ) => void;
  resetLevel: (levelId: string) => void;

  // Cards
  reviewCard: (cardId: string, correct: boolean) => void;

  // Topic mastery
  bumpTopicMastery: (topic: TopicId, hit01: number) => void;

  // Goals
  setGoalsForCurrentWeek: (goals: Omit<WeeklyGoal, 'id' | 'weekStart' | 'progress' | 'state' | 'createdAt'>[]) => void;
  /** Return goals for the current week (creates none on its own — call setGoalsForCurrentWeek). */
  currentGoals: () => WeeklyGoal[];
  abandonGoal: (goalId: string) => void;

  // Sessions
  recordSession: () => void;

  // Selectors
  getLevelProgress: (levelId: string) => LevelProgress | undefined;
  getCardProgress: (cardId: string) => CardProgress | undefined;
  getCompletedLevelCount: () => number;

  // Maintenance
  resetAll: () => void;
};

export type ProgressStore = Progress & ProgressActions;

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_PROGRESS,

      recordLevelAttempt: (levelId, { score, timeMs, topics }) => {
        const now = Date.now();
        const prev = get().levels[levelId];
        const safeScore = Math.max(0, Math.min(100, Math.round(score)));
        const completed = safeScore === 100;
        const next: LevelProgress = {
          bestScore: Math.max(prev?.bestScore ?? 0, safeScore),
          bestTimeMs: completed
            ? prev?.bestTimeMs == null
              ? timeMs
              : timeMs != null
                ? Math.min(prev.bestTimeMs, timeMs)
                : prev.bestTimeMs
            : (prev?.bestTimeMs ?? null),
          attempts: (prev?.attempts ?? 0) + 1,
          completedAt: prev?.completedAt ?? (completed ? now : null),
          lastPlayedAt: now,
          topics: Array.from(new Set([...(prev?.topics ?? []), ...topics])),
        };

        set({ levels: { ...get().levels, [levelId]: next } });

        // Push topic mastery: matchScore in [0,1] as the new sample.
        for (const t of topics) {
          get().bumpTopicMastery(t, safeScore / 100);
        }

        // Goal progress update for level-based goals.
        const updated = get().goals.map((g) => {
          if (g.state !== 'active' || g.weekStart !== weekStart(new Date(now))) return g;
          if (g.kind === 'levels' && completed) {
            const inc = (g.topic ? topics.includes(g.topic) : true) ? 1 : 0;
            const progress = g.progress + inc;
            return {
              ...g,
              progress,
              state: (progress >= g.target ? 'completed' : 'active') as WeeklyGoal['state'],
            };
          }
          return g;
        });
        set({ goals: updated });
      },

      resetLevel: (levelId) => {
        const { [levelId]: _gone, ...rest } = get().levels;
        void _gone;
        set({ levels: rest });
      },

      reviewCard: (cardId, correct) => {
        const now = Date.now();
        const prev = get().cards[cardId] ?? initialCardProgress(now);
        const next = applyReview(prev, correct, now);
        set({ cards: { ...get().cards, [cardId]: next } });

        // Goal progress for card-review goals.
        const updated = get().goals.map((g) => {
          if (g.state !== 'active' || g.weekStart !== weekStart(new Date(now))) return g;
          if (g.kind === 'cards') {
            const progress = g.progress + 1;
            return {
              ...g,
              progress,
              state: (progress >= g.target ? 'completed' : 'active') as WeeklyGoal['state'],
            };
          }
          return g;
        });
        set({ goals: updated });
      },

      bumpTopicMastery: (topic, hit01) => {
        const now = Date.now();
        const sanitized = Math.max(0, Math.min(1, hit01));
        const prev = get().topicMastery[topic];
        const nextScore =
          prev == null
            ? sanitized
            : prev.score * (1 - MASTERY_EMA_ALPHA) + sanitized * MASTERY_EMA_ALPHA;
        set({
          topicMastery: {
            ...get().topicMastery,
            [topic]: {
              score: nextScore,
              attempts: (prev?.attempts ?? 0) + 1,
              lastAttemptAt: now,
            },
          },
        });

        // Mastery goals: check if target reached for this topic.
        const updated = get().goals.map((g) => {
          if (g.state !== 'active' || g.weekStart !== weekStart(new Date(now))) return g;
          if (g.kind === 'topic-mastery' && g.topic === topic) {
            const progress = nextScore;
            return {
              ...g,
              progress,
              state: (progress >= g.target ? 'completed' : 'active') as WeeklyGoal['state'],
            };
          }
          return g;
        });
        set({ goals: updated });
      },

      setGoalsForCurrentWeek: (specs) => {
        const ws = weekStart();
        const now = Date.now();
        const previous = get().goals.filter((g) => g.weekStart !== ws);
        const fresh: WeeklyGoal[] = specs.map((s, i) => ({
          id: `${ws}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          weekStart: ws,
          kind: s.kind,
          description: s.description,
          target: s.target,
          topic: s.topic,
          progress: 0,
          state: 'active',
          createdAt: now,
        }));
        set({ goals: [...previous, ...fresh] });
      },

      currentGoals: () => {
        const ws = weekStart();
        return get().goals.filter((g) => g.weekStart === ws);
      },

      abandonGoal: (goalId) => {
        set({
          goals: get().goals.map((g) =>
            g.id === goalId ? { ...g, state: 'abandoned' as const } : g
          ),
        });
      },

      recordSession: () => {
        const now = Date.now();
        const key = todayKey(new Date(now));
        const current = get().sessionsByDay[key] ?? 0;
        set({
          sessionsByDay: { ...get().sessionsByDay, [key]: current + 1 },
        });

        // Session-count goals
        const updated = get().goals.map((g) => {
          if (g.state !== 'active' || g.weekStart !== weekStart(new Date(now))) return g;
          if (g.kind === 'session-count' && current === 0) {
            // increment only once per day (current was 0 BEFORE this session)
            const progress = g.progress + 1;
            return {
              ...g,
              progress,
              state: (progress >= g.target ? 'completed' : 'active') as WeeklyGoal['state'],
            };
          }
          return g;
        });
        set({ goals: updated });
      },

      getLevelProgress: (levelId) => get().levels[levelId],
      getCardProgress: (cardId) => get().cards[cardId],
      getCompletedLevelCount: () =>
        Object.values(get().levels).filter((l) => l.completedAt != null).length,

      resetAll: () => set({ ...INITIAL_PROGRESS }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        levels: state.levels,
        cards: state.cards,
        goals: state.goals,
        topicMastery: state.topicMastery,
        sessionsByDay: state.sessionsByDay,
      }),
    }
  )
);

/** Helper for non-React access (e.g. game store reaching into progress). */
export function recordLevelCompletionFromGame(
  levelId: string,
  args: { score: number; timeMs: number | null; topics: TopicId[] }
) {
  useProgressStore.getState().recordLevelAttempt(levelId, args);
  useProgressStore.getState().recordSession();
}

/** Re-export for convenience. */
export { weekStart, todayKey };

// Unused export keeps GoalKind import lint-happy in callers.
export type { GoalKind };
