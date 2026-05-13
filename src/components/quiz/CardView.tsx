'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Card } from '@/lib/types';

type Props = {
  card: Card;
  onAnswered: (correct: boolean) => void;
};

type State =
  | { phase: 'answering' }
  | { phase: 'revealed'; correct: boolean; userAnswer: string };

export function CardView({ card, onAnswered }: Props) {
  const t = useTranslations();
  const [state, setState] = useState<State>({ phase: 'answering' });
  const [textValue, setTextValue] = useState('');

  // Pull translatable strings via the keys stored on the card.
  const prompt = safeT(t, card.promptKey, card.promptKey);
  const explanation = card.explanationKey
    ? safeT(t, card.explanationKey, '')
    : '';

  const submit = (answer: string) => {
    const correct = isCorrect(card, answer);
    setState({ phase: 'revealed', correct, userAnswer: answer });
  };

  const next = () => {
    if (state.phase !== 'revealed') return;
    onAnswered(state.correct);
    setState({ phase: 'answering' });
    setTextValue('');
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-indigo-300">
          {t(`quiz.cardKind.${card.kind}` as 'quiz.cardKind.mcq')}
        </div>
        <h2 className="text-lg font-semibold text-slate-100">{prompt}</h2>
        {card.context && (
          <pre className="overflow-x-auto rounded-lg border border-white/5 bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-200">
            <code>{card.context}</code>
          </pre>
        )}
      </div>

      <div className="flex-1">
        {card.kind === 'mcq' && card.options && (
          <div className="grid gap-2">
            {card.options.map((opt) => {
              const selected = state.phase === 'revealed' && state.userAnswer === opt.id;
              const isAnswer = opt.id === card.answer;
              const showResult = state.phase === 'revealed';
              const cls = !showResult
                ? 'border-white/10 bg-white/5 hover:border-indigo-500/40 hover:bg-white/10'
                : isAnswer
                  ? 'border-emerald-500/60 bg-emerald-500/10'
                  : selected
                    ? 'border-rose-500/60 bg-rose-500/10'
                    : 'border-white/10 bg-white/[0.02] opacity-60';
              return (
                <button
                  key={opt.id}
                  onClick={() => state.phase === 'answering' && submit(opt.id)}
                  disabled={state.phase !== 'answering'}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition ${cls}`}
                >
                  <code className="font-mono text-sm text-slate-100">{opt.label}</code>
                  {showResult && isAnswer && <Check size={16} className="text-emerald-400" />}
                  {showResult && selected && !isAnswer && (
                    <X size={16} className="text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {card.kind === 'fill-blank' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (state.phase === 'answering' && textValue.trim()) submit(textValue.trim());
            }}
          >
            <input
              autoFocus
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              disabled={state.phase !== 'answering'}
              placeholder={t('quiz.fillPlaceholder')}
              className={`w-full rounded-lg border bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100 outline-none ${
                state.phase === 'revealed'
                  ? state.correct
                    ? 'border-emerald-500/60'
                    : 'border-rose-500/60'
                  : 'border-white/10 focus:border-indigo-400/60'
              }`}
            />
            {state.phase === 'answering' && (
              <button
                type="submit"
                disabled={!textValue.trim()}
                className="mt-3 w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
              >
                {t('quiz.submit')}
              </button>
            )}
          </form>
        )}
      </div>

      <AnimatePresence>
        {state.phase === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`rounded-lg border px-4 py-3 ${
              state.correct
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-rose-500/40 bg-rose-500/10'
            }`}
          >
            <div className="mb-1 text-sm font-semibold">
              {state.correct ? t('quiz.correct') : t('quiz.incorrect')}
            </div>
            {!state.correct && card.kind === 'fill-blank' && (
              <div className="mb-1 font-mono text-xs text-slate-300">
                {t('quiz.expected')}:{' '}
                {Array.isArray(card.answer) ? card.answer[0] : card.answer}
              </div>
            )}
            {explanation && <p className="text-sm text-slate-300">{explanation}</p>}
            <button
              onClick={next}
              className="mt-3 w-full rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/20"
            >
              {t('quiz.next')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function isCorrect(card: Card, userAnswer: string): boolean {
  if (Array.isArray(card.answer)) {
    return card.answer.some(
      (a) => a.trim().toLowerCase() === userAnswer.trim().toLowerCase()
    );
  }
  return card.answer === userAnswer;
}

// Use `t` with a runtime key — wrap it so we can supply a fallback.
function safeT(t: ReturnType<typeof useTranslations>, key: string, fallback: string): string {
  try {
    // useTranslations' return is typed-as-strict; cast at call site.
    return (t as unknown as (k: string) => string)(key) || fallback;
  } catch {
    return fallback;
  }
}
