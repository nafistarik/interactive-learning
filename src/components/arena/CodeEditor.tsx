"use client";

import Editor from "@monaco-editor/react";

/** Props for {@link CodeEditor}. */
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Monaco editor for Python. Loaded client-only by the arena (brief Part 3), so it never
 * renders on the server.
 *
 * @param props.value - The code shown in the editor.
 * @param props.onChange - Called with the new code on every edit.
 */
export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="320px"
      language="python"
      value={value}
      onChange={(next) => onChange(next ?? "")}
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
