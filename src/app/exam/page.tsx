import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CSS_QUIZ_CARDS } from '@/lib/quiz-data/css';
import { JS_QUIZ_CARDS } from '@/lib/quiz-data/js';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ExamHistory } from '@/components/exam/ExamHistory';

export default async function ExamHome() {
  const t = await getTranslations('exam');
  const tq = await getTranslations('quiz');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-2 flex items-center justify-between">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-100">
            ← {tq('backToHome')}
          </Link>
          <LanguageSwitcher compact />
        </div>

        <h1 className="mb-1 bg-gradient-to-r from-amber-300 via-fuchsia-400 to-rose-400 bg-clip-text text-4xl font-extrabold text-transparent">
          {t('title')}
        </h1>
        <p className="mb-10 text-sm text-slate-400">{t('subtitle')}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/exam/session?pillar=css"
            className="group rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-6 transition hover:border-indigo-400/50 hover:from-indigo-500/20"
          >
            <div className="mb-3 inline-flex rounded-md bg-indigo-500/20 px-2 py-1 font-mono text-xs uppercase tracking-wider text-indigo-200">
              CSS
            </div>
            <h2 className="text-xl font-bold text-white">{t('pickCss')}</h2>
            <p className="mt-1 text-xs text-slate-400">
              {t('cardsAvailable', { count: CSS_QUIZ_CARDS.length })}
            </p>
            <span className="mt-4 inline-block rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white group-hover:bg-indigo-400">
              {t('start')} →
            </span>
          </Link>

          <Link
            href="/exam/session?pillar=js"
            className="group rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-6 transition hover:border-amber-400/50 hover:from-amber-500/20"
          >
            <div className="mb-3 inline-flex rounded-md bg-amber-500/20 px-2 py-1 font-mono text-xs uppercase tracking-wider text-amber-200">
              JS
            </div>
            <h2 className="text-xl font-bold text-white">{t('pickJs')}</h2>
            <p className="mt-1 text-xs text-slate-400">
              {t('cardsAvailable', { count: JS_QUIZ_CARDS.length })}
            </p>
            <span className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 group-hover:bg-amber-400">
              {t('start')} →
            </span>
          </Link>
        </div>

        <ExamHistory />
      </div>
    </main>
  );
}
