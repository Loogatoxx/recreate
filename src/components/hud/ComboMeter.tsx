'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGameStore } from '@/lib/store';

export function ComboMeter() {
  const combo = useGameStore((s) => s.combo);
  const points = useGameStore((s) => s.points);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 ring-1 ring-amber-400/30">
        <span className="text-xs text-amber-300">⭐</span>
        <span className="font-mono text-sm font-bold tabular-nums text-amber-200">{points}</span>
      </div>

      <AnimatePresence>
        {combo >= 2 && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-1 shadow-lg shadow-orange-500/40"
          >
            <Flame size={14} className="text-white" />
            <span className="font-mono text-sm font-extrabold text-white">x{combo}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
