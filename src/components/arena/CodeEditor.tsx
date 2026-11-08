"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

/** A range of editor lines, both ends inclusive, as numbered in the editor. */
export interface LineRange {
  startLine: number;
  endLine: number;
}

/** Props for {@link CodeEditor}. */
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Lines of the current frame, highlighted while stepping. */
  highlight: LineRange | null;
  /** Line that failed in the current frame, marked with an error marker. */
  errorLine: number | null;
}

/**
 * Monaco editor for Python. Loaded client-only by the arena (brief Part 3). It highlights the
 * lines of the current execution frame and marks the failing line (brief Part 6.1).
 *
 * @param props.value - The code shown in the editor.
 * @param props.onChange - Called with the new code on every edit.
 * @param props.highlight - Lines to highlight, or `null` for none.
 * @param props.errorLine - Line to mark as failing, or `null` for none.
 */
export default function CodeEditor({ value, onChange, highlight, errorLine }: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationIds = useRef<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setMounted(true);
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) {
      return;
    }
    decorationIds.current = editor.deltaDecorations(
      decorationIds.current,
      highlight
        ? [
            {
              range: new monaco.Range(highlight.startLine, 1, highlight.endLine, 1),
              options: { isWholeLine: true, className: "frame-highlight" },
            },
          ]
        : [],
    );
  }, [highlight, mounted]);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor?.getModel();
    if (!monaco || !model) {
      return;
    }
    monaco.editor.setModelMarkers(
      model,
      "execution",
      errorLine === null
        ? []
        : [
            {
              severity: monaco.MarkerSeverity.Error,
              message: "This line stopped the run.",
              startLineNumber: errorLine,
              startColumn: 1,
              endLineNumber: errorLine,
              endColumn: model.getLineMaxColumn(errorLine),
            },
          ],
    );
  }, [errorLine, mounted]);

  return (
    <Editor
      height="320px"
      language="python"
      value={value}
      onChange={(next) => onChange(next ?? "")}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  );
}
