import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CSS_TOPICS, JS_TOPICS, topicsByGroup } from '@/lib/topics';
import { ALL_CARDS } from '@/lib/quiz-data';
import { QuizDueChip } from '@/components/quiz/QuizDueChip';
import { TopicGrid } from '@/components/quiz/TopicGrid';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default async function QuizHome() {
  const t = await getTranslations('quiz');

  // Build counts per topic so the UI can show "X cards available".
  const counts: Record<string, number> = {};
  for (const c of ALL_CARDS) {
    counts[c.topic] = (counts[c.topic] ?? 0) + 1;
  }

  // Build visible groups separately per pillar so the UI shows CSS then JS.
  const buildVisible = (pillar: 'css' | 'js') => {
    const groups = topicsByGroup(pillar);
    const visible = new Map<string, typeof CSS_TOPICS>();
    for (const [group, topics] of groups) {
      const filtered = topics.filter((tp) => (counts[tp.id] ?? 0) > 0);
      if (filtered.length > 0) visible.set(group, filtered);
    }
    return visible;
  };
  const cssVisible = buildVisible('css');
  const jsVisible = buildVisible('js');
  // Avoid unused-var on CSS_TOPICS / JS_TOPICS — they're for typing only here.
  void CSS_TOPICS;
  void JS_TOPICS;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-100"
          >
            ← {t('backToHome')}
          </Link>
          <LanguageSwitcher compact />
        </div>

        <h1 className="mb-1 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-4xl font-extrabold text-transparent">
          {t('title')}
        </h1>
        <p className="mb-8 text-sm text-slate-400">{t('subtitle')}</p>

        <div className="mb-8">
          <QuizDueChip />
        </div>

        <h2 className="mb-3 mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-indigo-200">CSS</span>
          {t('byTopic')}
        </h2>

        <TopicGrid
          groups={Array.from(cssVisible.entries()).map(([group, topics]) => ({
            group,
            pillar: 'css',
            topics: topics.map((tp) => ({
              id: tp.id,
              fallbackLabel: tp.fallbackLabel,
              cardCount: counts[tp.id] ?? 0,
            })),
          }))}
        />

        {jsVisible.size > 0 && (
          <>
            <h2 className="mb-3 mt-10 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500">
              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-amber-200">JS</span>
              {t('byTopic')}
            </h2>

            <TopicGrid
              groups={Array.from(jsVisible.entries()).map(([group, topics]) => ({
                group,
                pillar: 'js',
                topics: topics.map((tp) => ({
                  id: tp.id,
                  fallbackLabel: tp.fallbackLabel,
                  cardCount: counts[tp.id] ?? 0,
                })),
              }))}
            />
          </>
        )}

        <p className="mt-12 text-center text-xs text-slate-600">
          {t('seedNotice')}
        </p>
      </div>
    </main>
  );
}
