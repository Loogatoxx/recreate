'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CodePanel, type EditorLayout, type EditorTab, type RightPanel } from './CodePanel';
import { LivePreview, type FrameHandle } from './LivePreview';
import { TargetFrame } from './TargetFrame';
import { MatchGauge } from '@/components/hud/MatchGauge';
import { ComboMeter } from '@/components/hud/ComboMeter';
import { SOSButton } from '@/components/hud/SOSButton';
import { VictoryDialog } from '@/components/hud/VictoryDialog';
import { HintsBar } from '@/components/hud/HintsBar';
import {
  declarationStats,
  pixelRatio,
  progressScore,
  type DeclStats,
} from '@/lib/visual-diff';
import { selectorsForValue } from '@/lib/find-css-context';
import { useGameStore } from '@/lib/store';
import { useProgressStore } from '@/lib/progress-store';
import type { Level } from '@/lib/levels';

const HIGHLIGHT_STYLE_ID = 'recreate-hover-highlight';
const VICTORY_DELAY_MS = 1500;

type Props = { level: Level };

export function Cockpit({ level }: Props) {
  const tCockpit = useTranslations('cockpit');
  const tDifficulty = useTranslations('difficulty');
  const tLevels = useTranslations('levels');

  const levelTitle = (() => {
    try {
      return tLevels(`${level.id}.title` as Parameters<typeof tLevels>[0]);
    } catch {
      return level.title;
    }
  })();
  const levelBrief = (() => {
    try {
      return tLevels(`${level.id}.brief` as Parameters<typeof tLevels>[0]);
    } catch {
      return level.brief;
    }
  })();

  const [html, setHtml] = useState(level.starterHtml);
  const [css, setCss] = useState(level.starterCss);
  const [tab, setTab] = useState<EditorTab>('html');
  const [layout, setLayout] = useState<EditorLayout>('tabs');
  const [rightPanel, setRightPanel] = useState<RightPanel>(null);
  const [latestStats, setLatestStats] = useState<DeclStats | null>(null);

  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [victory, setVictory] = useState<{
    open: boolean;
    elapsedMs: number;
    pointsEarned: number;
    hintsUsedAtWin: number;
  }>({ open: false, elapsedMs: 0, pointsEarned: 0, hintsUsedAtWin: 0 });

  const previewRef = useRef<FrameHandle>(null);
  const targetRef = useRef<FrameHandle>(null);
  const targetReadyRef = useRef(false);
  const pointsAtStartRef = useRef(0);
  const wonRef = useRef(false);
  const baselineRef = useRef<DeclStats | null>(null);
  const victoryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setScore = useGameStore((s) => s.setScore);
  const triggerMilestone = useGameStore((s) => s.triggerMilestone);
  const incrementCombo = useGameStore((s) => s.incrementCombo);
  const resetLevel = useGameStore((s) => s.resetLevel);

  const resetAll = useCallback(() => {
    setHtml(level.starterHtml);
    setCss(level.starterCss);
    setStartedAt(Date.now());
    wonRef.current = false;
    baselineRef.current = null;
    if (victoryTimerRef.current) {
      clearTimeout(victoryTimerRef.current);
      victoryTimerRef.current = null;
    }
    setVictory({ open: false, elapsedMs: 0, pointsEarned: 0, hintsUsedAtWin: 0 });
    resetLevel();
    pointsAtStartRef.current = useGameStore.getState().points;
  }, [level.starterHtml, level.starterCss, resetLevel]);

  useEffect(() => {
    resetAll();
  }, [level.id, resetAll]);

  const runDiff = useCallback(async () => {
    if (wonRef.current) return;
    const userRoot = previewRef.current?.getRoot();
    const targetRoot = targetRef.current?.getRoot();
    if (!userRoot || !targetRoot || !targetReadyRef.current) return;

    const stats = declarationStats(level.targetCss, userRoot, targetRoot);
    setLatestStats(stats);

    // Capture baseline the first time we run with valid roots — at this moment the user
    // hasn't typed yet, so the preview shows the starter.
    if (!baselineRef.current) {
      baselineRef.current = stats;
      setScore(0);
      return;
    }

    const score = progressScore(stats, baselineRef.current);
    setScore(score);

    if (score >= 50) triggerMilestone(50);
    if (score >= 75 && triggerMilestone(75)) incrementCombo();
    if (score >= 90) triggerMilestone(90);

    // Lock 100% only when every target declaration is matched AND pixels essentially identical.
    if (stats.matched === stats.total && stats.total > 0) {
      try {
        const pixel = await pixelRatio(userRoot as HTMLElement, targetRoot as HTMLElement);
        if (pixel >= 0.99) {
          setScore(100);
          triggerMilestone(100);
          wonRef.current = true;
          const state = useGameStore.getState();
          const elapsedMs = Date.now() - startedAt;
          const pointsEarned = state.points - pointsAtStartRef.current;
          const hintsUsedAtWin = state.hintsUsed;

          // Persist this completion to cross-session progress + topic mastery.
          useProgressStore.getState().recordLevelAttempt(level.id, {
            score: 100,
            timeMs: elapsedMs,
            topics: level.topics,
          });
          useProgressStore.getState().recordSession();

          victoryTimerRef.current = setTimeout(() => {
            setVictory({ open: true, elapsedMs, pointsEarned, hintsUsedAtWin });
          }, VICTORY_DELAY_MS);
        } else {
          // Declarations all match but the rendering differs — extra styles in user code.
          setScore(99);
        }
      } catch {
        // ignore; score stays at decl-match value
      }
    }
  }, [level.targetCss, setScore, triggerMilestone, incrementCombo, startedAt]);

  useEffect(() => {
    const t = setTimeout(runDiff, 250);
    return () => clearTimeout(t);
  }, [html, css, runDiff]);

  // Inject/remove a highlight rule inside BOTH iframes for the given selectors string.
  const highlight = useCallback((selectors: string) => {
    const roots = [targetRef.current?.getRoot(), previewRef.current?.getRoot()];
    for (const root of roots) {
      const doc = root?.ownerDocument;
      if (!doc) continue;
      let style = doc.getElementById(HIGHLIGHT_STYLE_ID) as HTMLStyleElement | null;
      if (!style) {
        style = doc.createElement('style');
        style.id = HIGHLIGHT_STYLE_ID;
        doc.head.appendChild(style);
      }
      style.textContent = selectors
        ? `${selectors} { box-shadow: inset 0 0 0 3px #f43f5e, 0 0 0 3px #f43f5e !important; transition: box-shadow 0.12s !important; }`
        : '';
    }
  }, []);

  const handleHintHover = useCallback(
    (value: string | null) => {
      highlight(value ? selectorsForValue(level.targetCss, value) : '');
    },
    [highlight, level.targetCss]
  );

  const handleSelectorHover = useCallback(
    (selector: string | null) => {
      highlight(selector ?? '');
    },
    [highlight]
  );

  const dismissVictory = useCallback(() => {
    setVictory((v) => ({ ...v, open: false }));
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <header className="flex items-center justify-between gap-4 border-b border-white/5 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <ArrowLeft size={14} /> {tCockpit('backToLevels')}
          </Link>
          <span className="rounded-md bg-indigo-500/20 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-indigo-300">
            {tDifficulty(level.difficulty)}
          </span>
          <h1 className="font-mono text-sm font-semibold">{levelTitle}</h1>
          <button
            onClick={resetAll}
            className="ml-2 flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-100"
            title={tCockpit('restart')}
          >
            <RotateCcw size={12} />
          </button>
          <ComboMeter />
        </div>

        <MatchGauge />

        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <SOSButton
            levelId={level.id}
            targetHtml={level.targetHtml}
            targetCss={level.targetCss}
            currentHtml={html}
            currentCss={css}
          />
        </div>
      </header>

      {levelBrief && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/5 bg-white/[0.02] px-6 py-2 text-xs text-slate-300"
        >
          🎯 {levelBrief}
        </motion.div>
      )}

      <HintsBar css={level.targetCss} onHintHover={handleHintHover} />

      <Group orientation="horizontal" className="flex-1">
        <Panel defaultSize="40%" minSize="25%">
          <CodePanel
            html={html}
            css={css}
            onHtmlChange={setHtml}
            onCssChange={setCss}
            tab={tab}
            onTabChange={setTab}
            layout={layout}
            onLayoutChange={setLayout}
            rightPanel={rightPanel}
            onRightPanelChange={setRightPanel}
            diffStats={latestStats}
            onSelectorHover={handleSelectorHover}
          />
        </Panel>

        <ResizeHandle />

        <Panel defaultSize="30%" minSize="20%">
          <div className="flex h-full flex-col">
            <PanelHeader label={tCockpit('livePreview')} accent="from-emerald-400 to-cyan-400" />
            <div className="flex-1">
              <LivePreview ref={previewRef} html={html} css={css} onReady={runDiff} />
            </div>
          </div>
        </Panel>

        <ResizeHandle />

        <Panel defaultSize="30%" minSize="20%">
          <div className="flex h-full flex-col">
            <PanelHeader
              label={`🎯 ${tCockpit('target')}`}
              accent="from-fuchsia-400 to-rose-400"
              locked
              lockedLabel={tCockpit('inspectionDisabled')}
            />
            <div className="flex-1">
              <TargetFrame
                ref={targetRef}
                html={level.targetHtml}
                css={level.targetCss}
                onReady={() => {
                  targetReadyRef.current = true;
                  runDiff();
                }}
              />
            </div>
          </div>
        </Panel>
      </Group>

      <VictoryDialog
        open={victory.open}
        levelTitle={levelTitle}
        elapsedMs={victory.elapsedMs}
        pointsEarned={victory.pointsEarned}
        hintsUsed={victory.hintsUsedAtWin}
        onReplay={resetAll}
        onClose={dismissVictory}
      />
    </div>
  );
}

function ResizeHandle() {
  return (
    <Separator className="group relative w-1 cursor-col-resize bg-white/5 transition hover:bg-indigo-500/60">
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </Separator>
  );
}

function PanelHeader({
  label,
  accent,
  locked,
  lockedLabel,
}: {
  label: string;
  accent: string;
  locked?: boolean;
  lockedLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 bg-slate-950 px-4 py-2">
      <h2
        className={`bg-gradient-to-r ${accent} bg-clip-text font-mono text-sm font-bold text-transparent`}
      >
        {label}
      </h2>
      {locked && lockedLabel && (
        <span className="text-[10px] uppercase tracking-wider text-slate-500">
          {lockedLabel}
        </span>
      )}
    </div>
  );
}
