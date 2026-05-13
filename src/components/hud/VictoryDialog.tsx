'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Home, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store';

type Props = {
  open: boolean;
  levelTitle: string;
  elapsedMs: number;
  pointsEarned: number;
  hintsUsed: number;
  onReplay: () => void;
  onClose: () => void;
};

function formatTime(ms: number) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function rating(elapsedMs: number, hintsUsed: number): { stars: number; key: 'speedrun' | 'wellPlayed' | 'win' } {
  const seconds = elapsedMs / 1000;
  if (seconds < 30 && hintsUsed === 0) return { stars: 3, key: 'speedrun' };
  if (seconds < 90 && hintsUsed <= 1) return { stars: 2, key: 'wellPlayed' };
  return { stars: 1, key: 'win' };
}

export function VictoryDialog({
  open,
  levelTitle,
  elapsedMs,
  pointsEarned,
  hintsUsed,
  onReplay,
  onClose,
}: Props) {
  const t = useTranslations('victory');
  const points = useGameStore((s) => s.points);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const { stars, key } = rating(elapsedMs, hintsUsed);
  const label = t(key);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8 shadow-2xl shadow-indigo-500/30"
          >
            <button
              onClick={onClose}
              title={t('backToCode')}
              className="absolute right-3 top-3 z-10 rounded-md p-1 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
            >
              <X size={16} />
            </button>

            <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-emerald-500/20 opacity-50 blur-xl" />

            <div className="relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40"
              >
                <Trophy size={32} className="text-white" />
              </motion.div>

              <div className="mb-1 text-center font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
                {label}
              </div>
              <h2 className="mb-6 text-center text-2xl font-bold text-white">{levelTitle}</h2>

              <div className="mb-6 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                    className={`text-3xl ${i < stars ? '' : 'opacity-20 grayscale'}`}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <div className="mb-6 grid grid-cols-3 gap-3">
                <Stat label={t('time')} value={formatTime(elapsedMs)} accent="text-cyan-300" />
                <Stat label={t('earned')} value={`+${pointsEarned}`} accent="text-amber-300" />
                <Stat label={t('hints')} value={String(hintsUsed)} accent="text-fuchsia-300" />
              </div>

              <div className="mb-6 rounded-lg bg-white/5 px-4 py-2 text-center text-xs text-slate-400">
                {t('total')} <span className="font-mono font-bold text-amber-300">{points}</span>{' '}
                {t('points')}
              </div>

              <div className="mb-3 flex gap-2">
                <button
                  onClick={onReplay}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <RotateCcw size={14} />
                  {t('replay')}
                </button>
                <Link
                  href="/"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-fuchsia-400"
                >
                  <Home size={14} />
                  {t('menu')}
                </Link>
              </div>

              <button
                onClick={onClose}
                className="block w-full text-center text-xs text-slate-500 transition hover:text-slate-300"
              >
                {t('backToCode')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 font-mono text-lg font-bold tabular-nums ${accent}`}>{value}</div>
    </div>
  );
}
