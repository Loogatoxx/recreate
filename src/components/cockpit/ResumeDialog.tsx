'use client';

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
  open: boolean;
  savedAt: number;
  onResume: () => void;
  onRestart: () => void;
};

function formatRelative(savedAt: number, locale: string): string {
  const diff = Date.now() - savedAt;
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return new Date(savedAt).toLocaleString(locale);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  return new Date(savedAt).toLocaleDateString(locale);
}

export function ResumeDialog({ open, savedAt, onResume, onRestart }: Props) {
  const t = useTranslations('resume');
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="w-[420px] rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-2 text-center text-2xl">💾</div>
            <h2 className="mb-1 text-center text-lg font-semibold text-white">
              {t('title')}
            </h2>
            <p className="mb-1 text-center text-sm text-slate-400">{t('subtitle')}</p>
            <p className="mb-5 text-center font-mono text-xs text-slate-500">
              {t('savedAt', { ago: formatRelative(savedAt, 'fr') })}
            </p>

            <div className="flex gap-2">
              <button
                onClick={onRestart}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <RotateCcw size={14} />
                {t('restart')}
              </button>
              <button
                onClick={onResume}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-fuchsia-400"
              >
                <PlayCircle size={14} />
                {t('resume')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
