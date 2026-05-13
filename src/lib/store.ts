import { create } from 'zustand';

export type Milestone = 50 | 75 | 90 | 100;

type GameState = {
  score: number;
  combo: number;
  points: number;
  milestonesReached: ReadonlySet<Milestone>;
  hintsUsed: number;

  setScore: (score: number) => void;
  triggerMilestone: (m: Milestone) => boolean;
  incrementCombo: () => void;
  breakCombo: () => void;
  spendPoints: (cost: number) => boolean;
  resetLevel: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  combo: 0,
  points: 100,
  milestonesReached: new Set(),
  hintsUsed: 0,

  setScore: (score) => set({ score: Math.max(-100, Math.min(100, score)) }),

  triggerMilestone: (m) => {
    const reached = get().milestonesReached;
    if (reached.has(m)) return false;
    const next = new Set(reached);
    next.add(m);
    set({
      milestonesReached: next,
      points: get().points + m * 10,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('milestone', { detail: m }));
    }
    return true;
  },

  incrementCombo: () => set({ combo: get().combo + 1 }),
  breakCombo: () => set({ combo: 0 }),

  spendPoints: (cost) => {
    if (get().points < cost) return false;
    set({ points: get().points - cost, hintsUsed: get().hintsUsed + 1 });
    return true;
  },

  resetLevel: () =>
    set({
      score: 0,
      combo: 0,
      milestonesReached: new Set(),
      hintsUsed: 0,
    }),
}));
