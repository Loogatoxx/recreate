import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { GraduationCap, ListChecks } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES, LEVELS } from '@/lib/levels';
import { GenerateButton } from '@/components/home/GenerateButton';
import { LevelGrid } from '@/components/home/LevelGrid';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { WeeklyGoals } from '@/components/home/WeeklyGoals';
import { MasteryMap } from '@/components/home/MasteryMap';

export default async function Home() {
  const t = await getTranslations('home');

  // Render the tagline with the highlight span around <hl>...</hl>.
  const tagline = t.rich('tagline', {
    hl: (chunks) => <span className="text-indigo-300">{chunks}</span>,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="absolute right-6 top-6">
          <LanguageSwitcher />
        </div>

        <div className="mb-12 text-center">
          <h1 className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent">
            recreate
          </h1>
          <p className="mt-4 text-lg text-slate-400">{tagline}</p>
          <p className="mt-1 text-sm text-slate-500">{t('subtitle')}</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <WeeklyGoals />
          <MasteryMap />
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <GenerateButton />
          <Link
            href="/quiz"
            className="flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-5 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/20 sm:px-6"
          >
            <ListChecks size={16} />
            Quiz
          </Link>
          <Link
            href="/exam"
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20 sm:px-6"
          >
            <GraduationCap size={16} />
            Exam
          </Link>
        </div>

        <LevelGrid
          levels={LEVELS}
          categories={CATEGORIES}
          difficulties={DIFFICULTIES.filter((d) => d !== 'die-and-retry')}
        />

        <footer className="mt-20 text-center text-xs text-slate-600">{t('footer')}</footer>
      </div>
    </main>
  );
}
