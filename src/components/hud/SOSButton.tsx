'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store';

const HINT_COST = 20;

type Props = {
  levelId: string;
  targetHtml: string;
  targetCss: string;
  currentHtml: string;
  currentCss: string;
};

type HintState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'shown'; text: string }
  | { kind: 'error'; text: string };

export function SOSButton({
  levelId,
  targetHtml,
  targetCss,
  currentHtml,
  currentCss,
}: Props) {
  const t = useTranslations('hud');
  const locale = useLocale();
  const points = useGameStore((s) => s.points);
  const spendPoints = useGameStore((s) => s.spendPoints);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const [state, setState] = useState<HintState>({ kind: 'idle' });

  const updateAnchor = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setAnchor({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  };

  useEffect(() => {
    if (state.kind === 'idle') return;
    updateAnchor();
    const handler = () => updateAnchor();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [state.kind]);

  const requestHint = async () => {
    if (!spendPoints(HINT_COST)) return;
    setState({ kind: 'loading' });
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          levelId,
          targetHtml,
          targetCss,
          currentHtml,
          currentCss,
          locale,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { hint: string };
      setState({ kind: 'shown', text: data.hint });
    } catch {
      setState({ kind: 'error', text: t('sosError') });
    }
  };

  const canAfford = points >= HINT_COST;
  const popupOpen =
    state.kind === 'loading' || state.kind === 'shown' || state.kind === 'error';

  return (
    <>
      <motion.button
        ref={buttonRef}
        whileTap={{ scale: 0.95 }}
        disabled={!canAfford || state.kind === 'loading'}
        onClick={requestHint}
        className="group flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-gradient-to-r from-fuchsia-500/20 to-rose-500/20 px-4 py-1.5 text-sm font-semibold text-fuchsia-100 transition hover:from-fuchsia-500/30 hover:to-rose-500/30 disabled:opacity-40"
      >
        <Sparkles size={14} className="text-fuchsia-300" />
        {t('sos')}
        <span className="rounded-full bg-fuchsia-500/30 px-2 py-0.5 font-mono text-[10px]">
          -{HINT_COST}
        </span>
      </motion.button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {popupOpen && anchor && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                style={{ top: anchor.top, right: anchor.right }}
                className="fixed z-[90] w-80 rounded-xl border border-fuchsia-500/30 bg-slate-900/95 p-4 shadow-2xl shadow-fuchsia-500/30 backdrop-blur-md"
              >
                <button
                  onClick={() => setState({ kind: 'idle' })}
                  className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                >
                  <X size={14} />
                </button>
                {state.kind === 'loading' && (
                  <p className="text-sm text-fuchsia-200">{t('sosThinking')}</p>
                )}
                {state.kind === 'shown' && (
                  <>
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-fuchsia-400">
                      {t('sosHint')}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-100">{state.text}</p>
                  </>
                )}
                {state.kind === 'error' && (
                  <p className="text-sm text-rose-300">{state.text}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
