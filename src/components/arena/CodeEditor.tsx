"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

import { useTheme } from "@/features/theme/theme";

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
  /** Lines that define the operands of a failed step: the lines to fix (brief Part 9). */
  fixLines: LineRange[];
}

/**
 * Monaco editor for Python. Loaded client-only by the arena (brief Part 3). It highlights the
 * lines of the current execution frame and marks the failing line (brief Part 6.1).
 *
 * @param props.value - The code shown in the editor.
 * @param props.onChange - Called with the new code on every edit.
 * @param props.highlight - Lines to highlight, or `null` for none.
 * @param props.errorLine - Line to mark as failing, or `null` for none.
 * @param props.fixLines - Lines to highlight as the place to fix, drawn in amber.
 */
export default function CodeEditor({
  value,
  onChange,
  highlight,
  errorLine,
  fixLines,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationIds = useRef<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

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
    const current = highlight
      ? [{ range: new monaco.Range(highlight.startLine, 1, highlight.endLine, 1), options: { isWholeLine: true, className: "frame-highlight" } }]
      : [];
    const fixes = fixLines.map((lines) => ({
      range: new monaco.Range(lines.startLine, 1, lines.endLine, 1),
      options: { isWholeLine: true, className: "fix-highlight" },
    }));
    decorationIds.current = editor.deltaDecorations(decorationIds.current, [...current, ...fixes]);
  }, [highlight, fixLines, mounted]);

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
      theme={theme === "dark" ? "vs-dark" : "light"}
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
