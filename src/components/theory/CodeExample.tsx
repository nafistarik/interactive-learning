"use client";

import { Play } from "lucide-react";
import { useState } from "react";

import type { PythonRunResult } from "@/lib/python/run-python";
import { usePythonRuntime } from "@/features/execution/python-runtime-context";

/**
 * A code example from the lesson with what it prints. "Run" executes it for real in the
 * lesson's Pyodide worker and replaces the documented output with the actual one. (A test runs
 * every example and checks the documented output matches.)
 *
 * @param props.code - The Python example.
 * @param props.output - What the example prints, from the lesson data.
 */
export function CodeExample({ code, output }: { code: string; output: string }) {
  const { client, runtime } = usePythonRuntime(false);
  const [result, setResult] = useState<PythonRunResult | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    if (!client) {
      return;
    }
    setRunning(true);
    setResult(await client.run(code));
    setRunning(false);
  }

  const loadingText =
    runtime.state === "loading" ? (runtime.stage === "runtime" ? "Loading Python…" : runtime.stage === "numpy" ? "Loading NumPy…" : "Loading extra Python packages…") : "Running…";

  return (
    <figure className="overflow-hidden rounded-card border border-line">
      <div className="relative">
        <pre className="overflow-x-auto bg-surface-2 p-3 pr-20 font-mono text-sm leading-6">{code}</pre>
        <button
          type="button"
          onClick={run}
          disabled={!client || running}
          className="btn absolute right-2 top-2 px-2 py-1 text-xs"
          aria-label="Run this example in your browser"
        >
          <Play className="size-3" aria-hidden /> Run
        </button>
      </div>
      <figcaption className="border-t border-line bg-surface px-3 py-2">
        <span className="text-xs text-subtle">
          {running ? loadingText : result ? "Output, just run in your browser" : "Output"}
        </span>
        <pre
          aria-live="polite"
          className={`mt-1 overflow-x-auto font-mono text-sm ${result && !result.ok ? "text-danger" : ""}`}
        >
          {result ? [result.stdout, result.ok ? "" : result.error].filter(Boolean).join("\n") || "(no output)" : output}
        </pre>
      </figcaption>
    </figure>
  );
}
