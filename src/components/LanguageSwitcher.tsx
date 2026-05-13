'use client';

import { useLocale } from 'next-intl';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { changeLocale } from '@/app/actions/locale';
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/i18n/config';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const select = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(async () => {
      await changeLocale(next);
      router.refresh();
    });
  };

  const current = LOCALE_LABELS[locale];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className={`group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10 disabled:opacity-50 ${
          compact ? 'py-0.5' : ''
        }`}
        title="Language"
      >
        {compact ? (
          <span className="text-base leading-none">{current.flag}</span>
        ) : (
          <>
            <Globe size={12} className="text-slate-400" />
            <span className="text-base leading-none">{current.flag}</span>
            <span className="font-mono uppercase">{locale}</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-md"
            >
              {SUPPORTED_LOCALES.map((l) => {
                const meta = LOCALE_LABELS[l];
                const active = l === locale;
                return (
                  <button
                    key={l}
                    onClick={() => select(l)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-white/5 ${
                      active ? 'bg-indigo-500/10 text-indigo-200' : 'text-slate-200'
                    }`}
                  >
                    <span className="text-base">{meta.flag}</span>
                    <span className="flex-1">{meta.label}</span>
                    {active && <Check size={12} className="text-indigo-300" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
