'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/lib/store';

export function MatchGauge() {
  const score = useGameStore((s) => s.score);

  const target = useMotionValue(0);
  const spring = useSpring(target, { stiffness: 90, damping: 18 });
  const display = useTransform(spring, (v) => `${Math.round(v)}%`);

  // Bar fills from 0 to max(0, score). Negative scores never fill the green bar.
  const widthPct = useTransform(spring, (v) => `${Math.max(0, v)}%`);

  useEffect(() => {
    target.set(score);
  }, [score, target]);

  useEffect(() => {
    const onMilestone = (e: Event) => {
      const m = (e as CustomEvent<number>).detail;
      if (m === 100) {
        confetti({
          particleCount: 220,
          spread: 100,
          startVelocity: 55,
          origin: { y: 0.6 },
        });
      } else if (m >= 90) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
      }
    };
    window.addEventListener('milestone', onMilestone);
    return () => window.removeEventListener('milestone', onMilestone);
  }, []);

  const isNegative = score < 0;

  const color = isNegative
    ? 'from-rose-600 via-red-600 to-rose-700'
    : score < 25
      ? 'from-red-500 via-rose-500 to-orange-500'
      : score < 50
        ? 'from-orange-500 via-amber-400 to-yellow-400'
        : score < 75
          ? 'from-yellow-400 via-lime-400 to-emerald-400'
          : score < 90
            ? 'from-emerald-400 via-cyan-400 to-sky-400'
            : 'from-cyan-300 via-emerald-300 to-emerald-400';

  return (
    <div className="flex w-[28rem] items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Match</span>
      <div
        className={`relative h-3 flex-1 overflow-hidden rounded-full bg-white/5 ring-1 ${
          isNegative ? 'ring-rose-500/40' : 'ring-white/10'
        }`}
      >
        {isNegative && (
          // Subtle red pulse to signal regression while the bar stays empty.
          <motion.div
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute inset-0 bg-rose-500"
          />
        )}
        <motion.div
          style={{ width: widthPct }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      <motion.span
        className={`w-16 text-right font-mono text-lg font-bold tabular-nums ${
          isNegative ? 'text-rose-300' : 'text-white'
        }`}
      >
        {display}
      </motion.span>
    </div>
  );
}
