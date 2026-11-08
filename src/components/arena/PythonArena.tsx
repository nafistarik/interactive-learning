"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ExecutionFrame, RecordingOutcome } from "@/features/execution/frames";
import { PythonClient, type RuntimeStatus } from "@/features/execution/python-client";

import type { LineRange } from "./CodeEditor";

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
 * Text for the output panel of the frame on screen: what it printed, then its error or note.
 *
 * @param frame - The frame on screen.
 * @returns The text to show.
 */
function frameOutput(frame: ExecutionFrame): string {
  const parts = [frame.stdout.trimEnd()];
  if (frame.status === "error" && frame.error) {
    parts.push(`${frame.error.type}: ${frame.error.message}`);
  }
  if (frame.note) {
    parts.push(frame.note);
  }
  const text = parts.filter((part) => part !== "").join("\n");
  return text === "" ? "Ran without printed output." : text;
}

/**
 * Coding arena (brief Part 6) with the execution engine (brief Part 7). Run all records one
 * frame per statement; Step forward and back move through the recorded frames without running
 * the code again. Editing the code discards the frames. Pause and speed need the animation
 * (brief Part 8), so they stay disabled.
 *
 * @param props.starterCode - The code the editor starts with and Reset code returns to.
 */
export default function PythonArena({ starterCode }: { starterCode: string }) {
  const [code, setCode] = useState(starterCode);
  const [runtime, setRuntime] = useState<RuntimeStatus>({ state: "idle" });
  const [recording, setRecording] = useState<RecordingOutcome | null>(null);
  const [index, setIndex] = useState(0);
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

  const frames = useMemo(() => (recording?.ok ? recording.frames : []), [recording]);
  const frame = frames[index] ?? null;
  const lines: LineRange | null = frame ? { startLine: frame.startLine, endLine: frame.endLine } : null;
  const errorLine = frame?.status === "error" ? frame.startLine : null;
  const atLast = frames.length === 0 || index >= frames.length - 1;

  /** Records the current code and returns the recording, storing it on the page. */
  async function record(): Promise<RecordingOutcome | null> {
    const client = clientRef.current;
    if (!client) {
      return null;
    }
    setRunning(true);
    const outcome = await client.record(code);
    setRecording(outcome);
    setRunning(false);
    return outcome;
  }

  /** Records the code and jumps to its last frame. */
  async function runAll() {
    const outcome = await record();
    setIndex(outcome?.ok && outcome.frames.length > 0 ? outcome.frames.length - 1 : 0);
  }

  /** Records the code on the first step, or moves one frame forward through the recording. */
  async function stepForward() {
    if (recording === null) {
      const outcome = await record();
      setIndex(0);
      return outcome;
    }
    setIndex((current) => Math.min(current + 1, frames.length - 1));
    return null;
  }

  /** Discards the recording: the next run or step records the code again. */
  function resetExecution() {
    setRecording(null);
    setIndex(0);
  }

  /**
   * Updates the code. Any edit makes the recording stale, so it is discarded.
   *
   * @param next - The new code.
   */
  function changeCode(next: string) {
    setCode(next);
    resetExecution();
  }

  const failed = runtime.state === "failed";
  const recordingFailed = recording !== null && !recording.ok;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runAll}
          disabled={running || failed}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Run all
        </button>
        <button
          type="button"
          onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          disabled={running || frames.length === 0 || index === 0}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-700"
        >
          Step back
        </button>
        <button
          type="button"
          onClick={stepForward}
          disabled={running || failed || recordingFailed || (recording !== null && atLast)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-700"
        >
          Step forward
        </button>
        <button
          type="button"
          onClick={resetExecution}
          disabled={recording === null}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-700"
        >
          Reset execution
        </button>
        <button
          type="button"
          onClick={() => changeCode(starterCode)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
        >
          Reset code
        </button>
        {(["Pause", "Speed"] as const).map((label) => (
          <button
            key={label}
            type="button"
            disabled
            title="Needs the animation (brief Part 8)"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm opacity-40 dark:border-zinc-700"
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
        {describeStatus(runtime)}
        {failed ? (
          <button type="button" onClick={() => clientRef.current?.warm()} className="ml-3 underline">
            Retry
          </button>
        ) : null}
      </p>

      <CodeEditor
        value={code}
        onChange={changeCode}
        highlight={lines}
        errorLine={errorLine}
      />

      {frame ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Step {index + 1} of {frames.length} · lines {frame.startLine}
          {frame.endLine !== frame.startLine ? `–${frame.endLine}` : ""} · {frame.operationType}
        </p>
      ) : null}

      <pre
        aria-live="polite"
        className="min-h-24 whitespace-pre-wrap rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800"
      >
        {running
          ? "Running…"
          : recording === null
            ? "Output appears here."
            : recording.ok
              ? frame
                ? frameOutput(frame)
                : "The code has no statements."
              : recording.error}
      </pre>
    </div>
  );
}
