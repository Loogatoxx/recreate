'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

const STORAGE_KEY = 'recreate:ai-level';

const DIFFICULTIES = ['trivial', 'easy', 'medium', 'hard'] as const;

export function GenerateButton() {
  const router = useRouter();
  const locale = useLocale();
  const tHome = useTranslations('home');
  const tGen = useTranslations('generate');
  const tDifficulty = useTranslations('difficulty');

  const [open, setOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>('easy');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-level', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          theme: theme.trim() || undefined,
          locale,
        }),
      });
      const data = (await res.json()) as
        | { level: import('@/lib/levels').Level }
        | { error: string };
      if (!res.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Erreur inconnue');
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.level));
      router.push('/play/ai');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="group relative w-full overflow-hidden rounded-xl border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/20 via-indigo-500/15 to-emerald-500/15 p-5 text-left transition hover:border-fuchsia-400/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-lg shadow-fuchsia-500/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-fuchsia-100">{tHome('aiButton')}</div>
            <div className="text-xs text-slate-400">{tHome('aiSubtitle')}</div>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[440px] rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            >
              <button
                onClick={() => !loading && setOpen(false)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <X size={16} />
              </button>

              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-fuchsia-300" />
                <h2 className="font-semibold text-white">{tGen('title')}</h2>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">
                  {tGen('difficulty')}
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-wider transition ${
                        difficulty === d
                          ? 'bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-fuchsia-400/40'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {tDifficulty(d)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">
                  {tGen('theme')}
                </label>
                <input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder={tGen('themePlaceholder')}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-400/40 focus:outline-none focus:ring-1 focus:ring-fuchsia-400/40"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                  {error}
                </div>
              )}

              <button
                onClick={generate}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:from-fuchsia-400 hover:to-indigo-400 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {tGen('loading')}
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    {tGen('submit')}
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
