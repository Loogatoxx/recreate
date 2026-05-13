'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';

export type FrameHandle = {
  getRoot: () => HTMLElement | null;
};

type Props = {
  html: string;
  css: string;
  onReady?: () => void;
};

function buildSrcDoc(html: string, css: string) {
  return `<!doctype html><html><head><style>
*,*::before,*::after{box-sizing:border-box}
body{margin:0;padding:24px;background:white;color:#0f172a;font-family:system-ui,-apple-system,sans-serif;min-height:100vh}
button{cursor:pointer;font:inherit}
${css}
</style></head><body>${html}</body></html>`;
}

export const LivePreview = forwardRef<FrameHandle, Props>(function LivePreview(
  { html, css, onReady },
  ref
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useImperativeHandle(ref, () => ({
    getRoot: () => iframeRef.current?.contentDocument?.body ?? null,
  }));

  return (
    <iframe
      ref={iframeRef}
      srcDoc={buildSrcDoc(html, css)}
      sandbox="allow-same-origin"
      onLoad={onReady}
      className="h-full w-full border-0 bg-white"
      title="Live Preview"
    />
  );
});

export { buildSrcDoc };
