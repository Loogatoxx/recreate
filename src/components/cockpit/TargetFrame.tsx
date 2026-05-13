'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { type FrameHandle, buildSrcDoc } from './LivePreview';

type Props = {
  html: string;
  css: string;
  onReady?: () => void;
};

export const TargetFrame = forwardRef<FrameHandle, Props>(function TargetFrame(
  { html, css, onReady },
  ref
) {
  const t = useTranslations('cockpit');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useImperativeHandle(ref, () => ({
    getRoot: () => iframeRef.current?.contentDocument?.body ?? null,
  }));

  return (
    <div className="relative h-full w-full">
      <iframe
        ref={iframeRef}
        srcDoc={buildSrcDoc(html, css)}
        sandbox="allow-same-origin"
        onLoad={onReady}
        className="h-full w-full border-0 bg-white"
        title="Target"
      />
      <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 font-mono text-[10px] text-white/80 backdrop-blur">
        🔒 {t('readOnly')}
      </div>
    </div>
  );
});
