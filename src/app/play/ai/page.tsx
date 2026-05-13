'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Cockpit } from '@/components/cockpit/Cockpit';
import type { Level } from '@/lib/levels';

const STORAGE_KEY = 'recreate:ai-level';

export default function AiLevelPage() {
  const router = useRouter();
  const t = useTranslations('aiLevel');
  const [level, setLevel] = useState<Level | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setError(t('noLevel'));
        return;
      }
      const parsed = JSON.parse(raw) as Level;
      setLevel(parsed);
    } catch {
      setError(t('loadError'));
    }
  }, [t]);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
        <p className="text-slate-300">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          {t('backHome')}
        </button>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="h-2 w-32 animate-pulse rounded-full bg-indigo-500/30" />
      </div>
    );
  }

  return <Cockpit level={level} />;
}
