"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import type { ExecutionFrame, RecordingOutcome } from "@/features/execution/frames";
import type { Exercise, ValidationOutcome } from "@/features/validation/types";
import type { RuntimeStatus } from "@/features/execution/python-client";
import { usePythonRuntime } from "@/features/execution/python-runtime-context";
import { useProgress } from "@/features/progress/progress-context";

import { ExecutionTimeline } from "@/components/visualization/ExecutionTimeline";
import { FrameVisualizer } from "@/components/visualization/FrameVisualizer";
import { VariableInspector } from "@/components/visualization/VariableInspector";

import { findOperandDefinitions } from "@/features/visualization/definitions";

import type { LineRange } from "./CodeEditor";
import { ExercisePanel } from "./ExercisePanel";

/** Playback speeds offered for the animation (brief Part 6.2). */
const SPEEDS = [0.5, 1, 2] as const;

const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-subtle">Loading editor…</p>,
});

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
 * With an exercise, Check solution runs the validator (brief Part 10) and the panel shows the
 * feedback.
 *
 * @param props.starterCode - The code the editor starts with and Reset code returns to.
 * @param props.exercise - The exercise practised here, if the lesson has one.
 */
export default function PythonArena({
  starterCode,
  exercise,
}: {
  starterCode: string;
  exercise?: Exercise;
}) {
  const [code, setCode] = useState(starterCode);
  const [recording, setRecording] = useState<RecordingOutcome | null>(null);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);
  const [verdict, setVerdict] = useState<ValidationOutcome | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);
  const progress = useProgress();
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const { client, runtime } = usePythonRuntime();

  const frames = useMemo(() => (recording?.ok ? recording.frames : []), [recording]);
  const frame = frames[index] ?? null;
  const lines: LineRange | null = frame ? { startLine: frame.startLine, endLine: frame.endLine } : null;
  const errorLine = frame?.status === "error" ? frame.startLine : null;
  const atLast = frames.length === 0 || index >= frames.length - 1;
  const animated = frame !== null && frame.operations.length > 0;
  const failedStep =
    frame?.status === "error" && frame.error?.operandShapes
      ? (frame.operations[frame.operations.length - 1] ?? null)
      : null;
  const fixDefinitions = useMemo(
    () =>
      failedStep && index >= 0
        ? findOperandDefinitions(frames, index, [failedStep.leftName, failedStep.rightName])
        : [],
    [failedStep, frames, index],
  );
  const fixLines = useMemo<LineRange[]>(
    () =>
      fixDefinitions.map((definition) => ({
        startLine: definition.frame.startLine,
        endLine: definition.frame.endLine,
      })),
    [fixDefinitions],
  );

  /** Records the current code and returns the recording, storing it on the page. */
  async function record(): Promise<RecordingOutcome | null> {
    if (!client) {
      return null;
    }
    setRunning(true);
    const outcome = await client.record(code, exercise?.prelude ?? "");
    setRecording(outcome);
    setRunId((value) => value + 1);
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

  /** Checks the current code against the exercise and shows the verdict. */
  async function checkSolution() {
    if (!client || !exercise) {
      return;
    }
    setChecking(true);
    const outcome = await client.validate(code, exercise.runs, exercise.checks);
    setVerdict(outcome);
    setAttempts((value) => value + 1);
    progress.recordCheck(exercise.id, exercise.lessonId, outcome.passed);
    setChecking(false);
  }

  /**
   * Updates the code. Any edit makes the recording stale, so it is discarded, and the last
   * verdict no longer describes the code, so it is cleared.
   *
   * @param next - The new code.
   */
  function changeCode(next: string) {
    setCode(next);
    resetExecution();
    setVerdict(null);
  }

  const failed = runtime.state === "failed";
  const recordingFailed = recording !== null && !recording.ok;

  return (
    <div className="grid gap-4">
      {exercise ? (
        <ExercisePanel
          exercise={exercise}
          verdict={verdict}
          attempts={attempts}
          progress={progress.state.exercises[exercise.id]}
          onHintOpened={() => progress.recordHint(exercise.id)}
        />
      ) : null}

      <div className="sticky top-14 z-10 -mx-1 flex flex-wrap items-center gap-2 bg-canvas/95 px-1 py-2 backdrop-blur-sm">
        <button
          type="button"
          onClick={runAll}
          disabled={running || failed || !client}
          className="btn-primary"
        >
          Run all
        </button>
        <button
          type="button"
          onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          disabled={running || frames.length === 0 || index === 0}
          className="btn"
        >
          Step back
        </button>
        <button
          type="button"
          onClick={stepForward}
          disabled={running || failed || recordingFailed || (recording !== null && atLast)}
          className="btn"
        >
          Step forward
        </button>
        <button
          type="button"
          onClick={resetExecution}
          disabled={recording === null}
          className="btn"
        >
          Reset execution
        </button>
        {exercise ? (
          <button
            type="button"
            onClick={checkSolution}
            disabled={checking || running || failed}
            className="btn-success"
          >
            Check solution
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => changeCode(starterCode)}
          className="btn"
        >
          Reset code
        </button>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          disabled={!animated}
          className="btn"
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <label className="flex items-center gap-2 text-sm">
          Speed
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value) as (typeof SPEEDS)[number])}
            className="rounded-md border border-line-strong bg-surface px-2 py-1"
          >
            {SPEEDS.map((option) => (
              <option key={option} value={option}>
                {option}×
              </option>
            ))}
          </select>
        </label>
      <p className="ml-auto text-sm text-muted" role="status">
        {describeStatus(runtime)}
        {failed ? (
          <button type="button" onClick={() => client?.warm()} className="ml-3 underline">
            Retry
          </button>
        ) : null}
      </p>
      </div>



      <div className="grid gap-4 md:grid-cols-2">
        <CodeEditor
          value={code}
          onChange={changeCode}
          highlight={lines}
          errorLine={errorLine}
          fixLines={fixLines}
        />

        <div className="grid content-start gap-3">
          {frame ? (
            <p className="text-sm text-muted">
              Step {index + 1} of {frames.length} · lines {frame.startLine}
              {frame.endLine !== frame.startLine ? `–${frame.endLine}` : ""} · {frame.operationType}
            </p>
          ) : null}
          {frame ? (
            <FrameVisualizer key={`${runId}-${frame.index}`} frame={frame} paused={paused} speed={speed} />
          ) : (
            <p className="text-sm text-subtle">Run the code to see the arrays and the broadcasting here.</p>
          )}
          {fixDefinitions.length > 0 ? (
            <div role="status" className="grid gap-1 rounded-md border border-warn bg-warn-soft p-3 text-sm">
              <p className="font-medium">Fix the operand that does not match:</p>
              {fixDefinitions.map((definition) => (
                <p key={definition.name}>
                  {definition.name} is defined on line{" "}
                  {definition.frame.startLine === definition.frame.endLine
                    ? definition.frame.startLine
                    : `${definition.frame.startLine}–${definition.frame.endLine}`}
                  .
                </p>
              ))}
            </div>
          ) : null}
          <pre
            aria-live="polite"
            className="min-h-16 whitespace-pre-wrap rounded-md border border-line bg-surface p-3 font-mono text-sm"
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-label="Execution timeline" className="grid content-start gap-2">
          <h3 className="text-sm font-medium">Timeline</h3>
          <ExecutionTimeline
            frames={frames}
            current={index}
            onSelect={(next) => setIndex(next)}
          />
        </section>
        <section aria-label="Variables" className="grid content-start gap-2">
          <h3 className="text-sm font-medium">Variables</h3>
          <div className="overflow-x-auto">
            <VariableInspector variables={frame?.variables ?? []} />
          </div>
        </section>
      </div>
    </div>
  );
}
