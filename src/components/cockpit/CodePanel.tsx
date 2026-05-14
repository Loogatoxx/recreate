'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { BookOpen, Columns2, Layers, ListChecks, Rows2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { DeclStats } from '@/lib/visual-diff';

const ScriptEditor = dynamic(() => import('./ScriptEditor').then((m) => m.ScriptEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

const ManualPanel = dynamic(() => import('./ManualPanel').then((m) => m.ManualPanel), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

const DiffPanel = dynamic(() => import('./DiffPanel').then((m) => m.DiffPanel), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export type EditorTab = 'html' | 'css';
export type EditorLayout = 'tabs' | 'split-vertical' | 'split-horizontal';
export type RightPanel = 'manual' | 'diff' | null;

type Props = {
  html: string;
  css: string;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  tab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  layout: EditorLayout;
  onLayoutChange: (layout: EditorLayout) => void;
  rightPanel: RightPanel;
  onRightPanelChange: (p: RightPanel) => void;
  diffStats: DeclStats | null;
  onSelectorHover: (selector: string | null) => void;
};

export function CodePanel({
  html,
  css,
  onHtmlChange,
  onCssChange,
  tab,
  onTabChange,
  layout,
  onLayoutChange,
  rightPanel,
  onRightPanelChange,
  diffStats,
  onSelectorHover,
}: Props) {
  const t = useTranslations('tabs');
  const togglePanel = (p: Exclude<RightPanel, null>) =>
    onRightPanelChange(rightPanel === p ? null : p);

  return (
    <div className="flex h-full bg-slate-950">
      <div className="flex flex-1 flex-col">
        {/*
          Toolbar wraps onto a second row when the code panel is too narrow to fit
          everything on one line — the Diff and Manual buttons must always stay visible
          regardless of the user's drag position on the side separator.
        */}
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 border-b border-white/5 px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-2">
            {layout === 'tabs' && (
              <div className="flex gap-1">
                <TabButton
                  active={tab === 'html'}
                  onClick={() => onTabChange('html')}
                  color="indigo"
                  label="HTML"
                  ext=".html"
                />
                <TabButton
                  active={tab === 'css'}
                  onClick={() => onTabChange('css')}
                  color="fuchsia"
                  label="CSS"
                  ext=".css"
                />
              </div>
            )}
            {layout !== 'tabs' && (
              <div className="flex items-center gap-2 px-1 font-mono text-xs">
                <span className="text-indigo-300">HTML</span>
                <span className="text-slate-600">·</span>
                <span className="text-fuchsia-300">CSS</span>
              </div>
            )}
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2">
            <LayoutToggle layout={layout} onChange={onLayoutChange} />
            <PanelButton
              icon={<ListChecks size={12} />}
              label={t('diff')}
              active={rightPanel === 'diff'}
              onClick={() => togglePanel('diff')}
              count={diffStats ? diffStats.unmatched.length : null}
              accentClass="border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
              activeClass="border-rose-500/60 bg-rose-500/25 text-rose-100"
            />
            <PanelButton
              icon={<BookOpen size={12} />}
              label={t('manual')}
              active={rightPanel === 'manual'}
              onClick={() => togglePanel('manual')}
              accentClass="border-indigo-500/40 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20"
              activeClass="border-emerald-500/60 bg-emerald-500/15 text-emerald-200"
            />
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {layout === 'tabs' ? (
            <>
              <div className={tab === 'html' ? 'absolute inset-0' : 'absolute inset-0 hidden'}>
                <ScriptEditor value={html} onChange={onHtmlChange} language="html" />
              </div>
              <div className={tab === 'css' ? 'absolute inset-0' : 'absolute inset-0 hidden'}>
                <ScriptEditor value={css} onChange={onCssChange} language="css" />
              </div>
            </>
          ) : (
            <Group
              orientation={layout === 'split-vertical' ? 'horizontal' : 'vertical'}
              className="h-full"
            >
              <Panel defaultSize="50%" minSize="20%">
                <div className="flex h-full flex-col">
                  <SubHeader label="HTML" color="text-indigo-300" />
                  <div className="flex-1">
                    <ScriptEditor value={html} onChange={onHtmlChange} language="html" />
                  </div>
                </div>
              </Panel>
              <SplitHandle vertical={layout === 'split-vertical'} />
              <Panel defaultSize="50%" minSize="20%">
                <div className="flex h-full flex-col">
                  <SubHeader label="CSS" color="text-fuchsia-300" />
                  <div className="flex-1">
                    <ScriptEditor value={css} onChange={onCssChange} language="css" />
                  </div>
                </div>
              </Panel>
            </Group>
          )}
        </div>
      </div>

      <AnimatePresence>
        {rightPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 overflow-hidden border-l border-white/5"
          >
            <div className="h-full w-[300px]">
              {rightPanel === 'manual' && <ManualPanel />}
              {rightPanel === 'diff' && (
                <DiffPanel stats={diffStats} onSelectorHover={onSelectorHover} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelButton({
  icon,
  label,
  active,
  onClick,
  count,
  accentClass,
  activeClass,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number | null;
  accentClass: string;
  activeClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition ${
        active ? activeClass : accentClass
      }`}
    >
      {icon}
      {label}
      {count != null && count > 0 && (
        <span className="rounded-full bg-black/30 px-1.5 font-mono text-[10px] tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}

function LayoutToggle({
  layout,
  onChange,
}: {
  layout: EditorLayout;
  onChange: (l: EditorLayout) => void;
}) {
  const t = useTranslations('tabs');
  const opts: Array<{ value: EditorLayout; icon: React.ReactNode; title: string }> = [
    { value: 'tabs', icon: <Layers size={12} />, title: t('tabsMode') },
    { value: 'split-vertical', icon: <Columns2 size={12} />, title: t('sideBySide') },
    { value: 'split-horizontal', icon: <Rows2 size={12} />, title: t('topBottom') },
  ];

  return (
    <div className="flex gap-0.5 rounded-md bg-white/5 p-0.5">
      {opts.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          title={o.title}
          className={`flex h-6 w-7 items-center justify-center rounded transition ${
            layout === o.value
              ? 'bg-indigo-500/30 text-indigo-200'
              : 'text-slate-500 hover:text-slate-200'
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}

function SubHeader({ label, color }: { label: string; color: string }) {
  return (
    <div className="border-b border-white/5 bg-slate-950/60 px-3 py-1">
      <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${color}`}>
        {label}
      </span>
    </div>
  );
}

function SplitHandle({ vertical }: { vertical: boolean }) {
  return (
    <Separator
      className={`bg-white/5 transition hover:bg-indigo-500/60 ${
        vertical ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'
      }`}
    />
  );
}

function TabButton({
  active,
  onClick,
  label,
  ext,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  ext: string;
  color: 'indigo' | 'fuchsia';
}) {
  const accent =
    color === 'indigo'
      ? active
        ? 'bg-indigo-500/15 text-indigo-200 ring-indigo-400/40'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      : active
        ? 'bg-fuchsia-500/15 text-fuchsia-200 ring-fuchsia-400/40'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5';

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs font-medium transition ${accent} ${active ? 'ring-1' : ''}`}
    >
      <span className="font-bold">{label}</span>
      <span className="opacity-60">{ext}</span>
    </button>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-950">
      <div className="h-2 w-32 animate-pulse rounded-full bg-indigo-500/30" />
    </div>
  );
}
