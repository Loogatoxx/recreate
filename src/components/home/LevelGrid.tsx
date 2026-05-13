'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Category, Difficulty, Level } from '@/lib/levels';

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  trivial: 'from-emerald-500/20 to-emerald-500/5 ring-emerald-400/30 text-emerald-300',
  easy: 'from-cyan-500/20 to-cyan-500/5 ring-cyan-400/30 text-cyan-300',
  medium: 'from-amber-500/20 to-amber-500/5 ring-amber-400/30 text-amber-300',
  hard: 'from-rose-500/20 to-rose-500/5 ring-rose-400/30 text-rose-300',
  'die-and-retry': 'from-fuchsia-500/20 to-fuchsia-500/5 ring-fuchsia-400/30 text-fuchsia-300',
};

type Props = {
  levels: Level[];
  categories: { value: Category; label: string; emoji: string }[];
  difficulties: Difficulty[];
};

export function LevelGrid({ levels, categories, difficulties }: Props) {
  const t = useTranslations();
  const tHome = useTranslations('home');
  const tCategories = useTranslations('categories');
  const tDifficulty = useTranslations('difficulty');
  const tCommon = useTranslations('common');
  const tLevels = useTranslations('levels');

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(
    () =>
      levels.filter(
        (l) =>
          (selectedCategory == null || l.category === selectedCategory) &&
          (selectedDifficulty == null || l.difficulty === selectedDifficulty)
      ),
    [levels, selectedCategory, selectedDifficulty]
  );

  const levelTitle = (id: string, fallback: string) => {
    try {
      return tLevels(`${id}.title` as Parameters<typeof tLevels>[0]);
    } catch {
      return fallback;
    }
  };
  const levelBrief = (id: string, fallback: string) => {
    try {
      return tLevels(`${id}.brief` as Parameters<typeof tLevels>[0]);
    } catch {
      return fallback;
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          {tHome('filtersCategory')}
        </span>
        <FilterChip
          active={selectedCategory == null}
          onClick={() => setSelectedCategory(null)}
          label={tCommon('all')}
          accent="indigo"
        />
        {categories.map((c) => (
          <FilterChip
            key={c.value}
            active={selectedCategory === c.value}
            onClick={() =>
              setSelectedCategory((cur) => (cur === c.value ? null : c.value))
            }
            label={`${c.emoji} ${tCategories(c.value)}`}
            accent="indigo"
          />
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          {tHome('filtersDifficulty')}
        </span>
        <FilterChip
          active={selectedDifficulty == null}
          onClick={() => setSelectedDifficulty(null)}
          label={tCommon('all')}
          accent="fuchsia"
        />
        {difficulties.map((d) => (
          <FilterChip
            key={d}
            active={selectedDifficulty === d}
            onClick={() => setSelectedDifficulty((cur) => (cur === d ? null : d))}
            label={tDifficulty(d)}
            accent="fuchsia"
          />
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wider text-slate-500">
          {t('home.levelCount', { count: filtered.length })}
        </h2>
        {(selectedCategory != null || selectedDifficulty != null) && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedDifficulty(null);
            }}
            className="font-mono text-xs text-slate-500 hover:text-slate-300"
          >
            {tCommon('reset')}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-sm text-slate-500">
          {tHome('noLevels')}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((level, i) => {
            const cat = categories.find((c) => c.value === level.category);
            return (
              <motion.div
                key={level.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
              >
                <Link
                  href={`/play/${level.id}`}
                  className="group block overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-5 transition hover:border-indigo-500/40 hover:bg-white/[0.06]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] uppercase tracking-wider ring-1 ${
                        DIFFICULTY_STYLES[level.difficulty]
                      }`}
                    >
                      {tDifficulty(level.difficulty)}
                    </span>
                    {cat && (
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                        {cat.emoji} {tCategories(cat.value)}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-slate-100">
                    {levelTitle(level.id, level.title)}
                  </h3>
                  <p className="text-sm text-slate-400">{levelBrief(level.id, level.brief)}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  accent: 'indigo' | 'fuchsia';
}) {
  const palette =
    accent === 'indigo'
      ? active
        ? 'bg-indigo-500/25 text-indigo-100 ring-indigo-400/50'
        : 'bg-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10'
      : active
        ? 'bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/50'
        : 'bg-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10';

  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs transition ${palette} ${
        active ? 'ring-1' : ''
      }`}
    >
      {label}
    </button>
  );
}
