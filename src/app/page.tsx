import { getTranslations } from 'next-intl/server';
import { CATEGORIES, DIFFICULTIES, LEVELS } from '@/lib/levels';
import { GenerateButton } from '@/components/home/GenerateButton';
import { LevelGrid } from '@/components/home/LevelGrid';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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

        <div className="mb-6">
          <GenerateButton />
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
