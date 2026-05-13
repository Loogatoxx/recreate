'use client';

import Editor, { type OnMount } from '@monaco-editor/react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css';
};

export function ScriptEditor({ value, onChange, language }: Props) {
  const handleMount: OnMount = (_editor, monaco) => {
    monaco.editor.defineTheme('recreate-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0a0f1e',
        'editor.lineHighlightBackground': '#1a1f3a40',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#a5b4fc',
        'editor.selectionBackground': '#6366f140',
        'editor.inactiveSelectionBackground': '#6366f120',
      },
    });
    monaco.editor.setTheme('recreate-dark');
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        formatOnPaste: true,
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        padding: { top: 12, bottom: 12 },
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        quickSuggestionsDelay: 50,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'smart',
        wordBasedSuggestions: 'allDocuments',
        suggest: {
          showWords: true,
          showProperties: true,
          showSnippets: true,
          showFunctions: true,
          showVariables: true,
          showColors: true,
          insertMode: 'replace',
          filterGraceful: true,
          preview: true,
        },
        parameterHints: { enabled: true, cycle: true },
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoIndent: 'full',
        formatOnType: true,
      }}
    />
  );
}
