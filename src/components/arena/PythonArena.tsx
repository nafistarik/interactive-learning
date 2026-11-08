"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { PythonClient, type RuntimeStatus } from "@/features/execution/python-client";
import type { PythonRunResult } from "@/lib/python/run-python";

const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-zinc-500">Loading editor…</p>,
});

/**
 * Creates the Python worker. The bundler turns the URL into a separate file, so the worker
 * code never runs on the page's main thread.
 *
 * @returns A new worker running `python.worker.ts`.
 */
function createPythonWorker(): Worker {
  return new Worker(new URL("../../workers/python.worker.ts", import.meta.url), {
    type: "module",
  });
}

/**
 * Describes the runtime state in one line for the user.
 *
 * @param status - The runtime state.
 * @returns The status text.
 */
function describeStatus(status: RuntimeStatus): string {
  switch (status.state) {
    case "idle":
      return "Python not loaded yet.";
    case "loading":
      return status.stage === "runtime" ? "Loading Python…" : "Loading NumPy…";
    case "ready":
      return "Python and NumPy ready.";
    case "failed":
      return "Python could not load.";
  }
}

/**
 * Text for the output panel: what the code printed, then the error if it failed. A run that
 * printed nothing and succeeded says so, instead of showing an empty box.
 *
 * @param result - The run result.
 * @returns The text to show.
 */
function outputText(result: PythonRunResult): string {
  if (result.ok) {
    return result.stdout === "" ? "Ran without printed output." : result.stdout;
  }
  return [result.stdout, result.error].filter((part) => part !== "").join("\n");
}

/**
 * Coding arena (brief Part 6): the editor, run controls and output. Starts loading Python
 * when it mounts. Step, pause and speed need the execution engine (Part 7) and the
 * animation (Part 8), so those buttons stay disabled until they exist.
 *
 * @param props.starterCode - The code the editor starts with and Reset code returns to.
 */
export default function PythonArena({ starterCode }: { starterCode: string }) {
  const [code, setCode] = useState(starterCode);
  const [runtime, setRuntime] = useState<RuntimeStatus>({ state: "idle" });
  const [result, setResult] = useState<PythonRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const clientRef = useRef<PythonClient | null>(null);

  useEffect(() => {
    const client = new PythonClient(createPythonWorker, setRuntime);
    clientRef.current = client;
    client.warm();
    return () => {
      client.dispose();
      clientRef.current = null;
    };
  }, []);

  /** Runs the whole editor code once and shows its output. */
  async function runAll() {
    const client = clientRef.current;
    if (!client) {
      return;
    }
    setRunning(true);
    setResult(await client.run(code));
    setRunning(false);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runAll}
          disabled={running || runtime.state === "failed"}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Run all
        </button>
        <button
          type="button"
          onClick={() => setCode(starterCode)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
        >
          Reset code
        </button>
        <button
          type="button"
          onClick={() => setResult(null)}
          disabled={result === null}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-700"
        >
          Reset execution
        </button>
        {(["Step back", "Step forward", "Pause", "Speed"] as const).map((label) => (
          <button
            key={label}
            type="button"
            disabled
            title="Needs the execution engine (brief Part 7)"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm opacity-40 dark:border-zinc-700"
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
        {describeStatus(runtime)}
        {runtime.state === "failed" ? (
          <button
            type="button"
            onClick={() => clientRef.current?.warm()}
            className="ml-3 underline"
          >
            Retry
          </button>
        ) : null}
      </p>

      <CodeEditor value={code} onChange={setCode} />

      <pre
        aria-live="polite"
        className="min-h-24 whitespace-pre-wrap rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800"
      >
        {running
          ? "Running…"
          : result === null
            ? "Output appears here."
            : outputText(result)}
      </pre>
    </div>
  );
}
