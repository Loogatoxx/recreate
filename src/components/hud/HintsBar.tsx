'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { extractHints } from '@/lib/extract-hints';
import { findCssContext, type CssContext } from '@/lib/find-css-context';

type Props = {
  css: string;
  onHintHover?: (value: string | null) => void;
};

export function HintsBar({ css, onHintHover }: Props) {
  const t = useTranslations('hud');
  const hints = useMemo(() => extractHints(css), [css]);
  const [copied, setCopied] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied((c) => (c === value ? null : c)), 1200);
    } catch {
      // clipboard denied — fail silently
    }
  };

  const enter = (value: string) => {
    setHovered(value);
    onHintHover?.(value);
  };
  const leave = () => {
    setHovered(null);
    onHintHover?.(null);
  };

  const getContext = (value: string) => findCssContext(css, value);

  const hasContent =
    hints.colors.length > 0 || hints.sizes.length > 0 || hints.fonts.length > 0;
  if (!hasContent) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/5 bg-white/[0.02] px-6 py-2 text-xs">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
        {t('ingredients')}
      </span>

      {hints.colors.length > 0 && (
        <Group label="🎨">
          {hints.colors.map((c) => (
            <Ingredient
              key={c}
              value={c}
              copied={copied === c}
              hovered={hovered === c}
              context={getContext(c)}
              onCopy={() => copy(c)}
              onEnter={() => enter(c)}
              onLeave={leave}
              kind="color"
            />
          ))}
        </Group>
      )}

      {hints.sizes.length > 0 && (
        <Group label="📏">
          {hints.sizes.map((s) => (
            <Ingredient
              key={s}
              value={s}
              copied={copied === s}
              hovered={hovered === s}
              context={getContext(s)}
              onCopy={() => copy(s)}
              onEnter={() => enter(s)}
              onLeave={leave}
              kind="size"
            />
          ))}
        </Group>
      )}

      {hints.fonts.length > 0 && (
        <Group label="✍️">
          {hints.fonts.map((f) => (
            <Ingredient
              key={f}
              value={f}
              copied={copied === f}
              hovered={hovered === f}
              context={getContext(f)}
              onCopy={() => copy(f)}
              onEnter={() => enter(f)}
              onLeave={leave}
              kind="font"
            />
          ))}
        </Group>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs">{label}</span>
      <div className="flex flex-wrap items-center gap-1">{children}</div>
    </div>
  );
}

type IngredientProps = {
  value: string;
  copied: boolean;
  hovered: boolean;
  context: CssContext[];
  onCopy: () => void;
  onEnter: () => void;
  onLeave: () => void;
  kind: 'color' | 'size' | 'font';
};

function Ingredient({
  value,
  copied,
  hovered,
  context,
  onCopy,
  onEnter,
  onLeave,
  kind,
}: IngredientProps) {
  const display = kind === 'font' ? value.split(',')[0].replace(/['"]/g, '').trim() : value;

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <button
        onClick={onCopy}
        className={`group flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 transition hover:bg-white/10 ${
          hovered ? 'ring-1 ring-rose-400/50' : ''
        }`}
        style={kind === 'font' ? { fontFamily: value } : undefined}
      >
        {kind === 'color' && (
          <span
            className="h-3.5 w-3.5 rounded-sm ring-1 ring-white/20"
            style={{ background: value }}
          />
        )}
        <span className="font-mono text-[10px] text-slate-300">{display}</span>
        <CopyIcon copied={copied} />
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 min-w-[200px] -translate-x-1/2 rounded-md border border-white/10 bg-slate-900/95 px-2.5 py-2 shadow-xl backdrop-blur-md"
          >
            <div className="mb-1 font-mono text-[10px] text-slate-500">{value}</div>
            <ContextLines context={context} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContextLines({ context }: { context: CssContext[] }) {
  const t = useTranslations('hud');
  if (context.length === 0) {
    return <div className="text-[10px] italic text-slate-500">{t('notFound')}</div>;
  }
  const shown = context.slice(0, 4);
  const extra = context.length - shown.length;
  return (
    <div className="space-y-0.5">
      {shown.map((c, i) => (
        <div key={i} className="font-mono text-[10px]">
          <span className="text-indigo-300">{c.selector}</span>
          <span className="text-slate-500"> → </span>
          <span className="text-fuchsia-200">{c.property}</span>
        </div>
      ))}
      {extra > 0 && (
        <div className="text-[10px] italic text-slate-500">
          {t('andMore', { count: extra })}
        </div>
      )}
    </div>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {copied ? (
        <motion.span
          key="check"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="text-emerald-400"
        >
          <Check size={10} />
        </motion.span>
      ) : (
        <motion.span
          key="copy"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          exit={{ scale: 0, opacity: 0 }}
          className="text-slate-400 group-hover:opacity-100"
        >
          <Copy size={10} />
        </motion.span>
      )}
    </AnimatePresence>
  );
}
