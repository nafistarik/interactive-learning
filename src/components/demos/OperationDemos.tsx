"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";

import { ExecutionTimeline } from "@/components/visualization/ExecutionTimeline";
import { FrameVisualizer } from "@/components/visualization/FrameVisualizer";
import {
  broadcastShapesCode,
  ELEMENTWISE_OPERATORS,
  elementwiseCode,
  parseTimings,
  TIMING_CODE,
  TIMING_SIZE,
  XWB_CODE,
} from "@/features/demos/demo-code";
import { usePythonRuntime } from "@/features/execution/python-runtime-context";

import { FIELD } from "./ArrayDemos";
import { DemoFrame } from "./DemoFrame";
import { useDemoRecording } from "./use-demo-recording";

/** Lesson 05: times a Python loop against one NumPy operation, for real, in this browser. */
export function VectorizationTimingDemo() {
  const { client, runtime } = usePythonRuntime();
  const [timings, setTimings] = useState<{ loopMs: number; numpyMs: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  async function measure() {
    if (!client) {
      return;
    }
    setRunning(true);
    setError(null);
    const result = await client.run(TIMING_CODE);
    const parsed = result.ok ? parseTimings(result.stdout) : null;
    setTimings(parsed);
    setError(parsed ? null : result.ok ? "The timing output could not be read." : result.error);
    setRunning(false);
  }

  const max = timings ? Math.max(timings.loopMs, timings.numpyMs) : 1;
  const ready = runtime.state === "ready";

  return (
    <DemoFrame
      title="Loop vs vectorized: measure it"
      code={TIMING_CODE}
      controls={
        <>
          <button type="button" onClick={measure} disabled={!client || running || runtime.state === "failed"} className="btn-primary">
            <Play className="size-4" aria-hidden /> {timings ? "Measure again" : "Measure"}
          </button>
          <span className="text-xs text-subtle">
            {running ? "Measuring…" : ready ? `Computes x * 2 + 1 for ${TIMING_SIZE.toLocaleString("en")} numbers both ways.` : runtime.state === "failed" ? "Python could not load." : "Loading Python…"}
          </span>
        </>
      }
    >
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {timings ? (
        <figure className="grid gap-3">
          {[
            { label: "Python loop, one element at a time", ms: timings.loopMs, tone: "bg-tone-weight" },
            { label: "NumPy, one operation on the whole array", ms: timings.numpyMs, tone: "bg-tone-result" },
          ].map((bar) => (
            <div key={bar.label} className="grid gap-1 text-sm">
              <div className="flex justify-between gap-3">
                <span>{bar.label}</span>
                <span className="font-mono tabular-nums">{bar.ms.toFixed(2)} ms</span>
              </div>
              <div className="h-3 rounded-full bg-surface-2">
                <div className={`h-3 rounded-full ${bar.tone}`} style={{ width: `${Math.max((bar.ms / max) * 100, 0.5)}%` }} />
              </div>
            </div>
          ))}
          <figcaption className="text-xs text-subtle">
            Measured in your browser (Python on WebAssembly).
            {timings.numpyMs > 0 ? ` NumPy was about ${Math.round(timings.loopMs / timings.numpyMs)}× faster this time.` : ""}{" "}
            Numbers change from run to run and machine to machine.
          </figcaption>
        </figure>
      ) : null}
    </DemoFrame>
  );
}

/** Lesson 06: pick an operator; the recorded step pairs up elements and builds the result. */
export function ElementwiseDemo() {
  const [operator, setOperator] = useState<(typeof ELEMENTWISE_OPERATORS)[number]>("*");
  const code = elementwiseCode([1, 2, 3, 4], [10, 20, 30, 40], operator);
  const recording = useDemoRecording(code);
  const frame = recording.state === "ready" ? recording.frames[recording.frames.length - 1] : undefined;

  return (
    <DemoFrame
      title="Element by element"
      code={code}
      recording={recording}
      controls={
        <fieldset className="flex gap-1" aria-label="Operator">
          {ELEMENTWISE_OPERATORS.map((option) => (
            <label key={option} className={`btn cursor-pointer font-mono ${operator === option ? "border-accent bg-accent-soft" : ""}`}>
              <input type="radio" name="operator" className="sr-only" checked={operator === option} onChange={() => setOperator(option)} />
              {option}
            </label>
          ))}
        </fieldset>
      }
    >
      {frame ? <FrameVisualizer key={code} frame={frame} paused={false} speed={1} /> : null}
    </DemoFrame>
  );
}

/** Parses "3, 2" into a shape of 1 to 3 axes, each 1 to 6; `null` when invalid. */
function parseShape(text: string): number[] | null {
  const parts = text.split(",").map((part) => part.trim()).filter((part) => part !== "");
  const shape = parts.map(Number);
  return shape.length >= 1 && shape.length <= 3 && shape.every((n) => Number.isInteger(n) && n >= 1 && n <= 6) ? shape : null;
}

/** Lesson 07: type two shapes; NumPy decides whether they broadcast, and the view shows why. */
export function BroadcastShapesDemo() {
  const [leftText, setLeftText] = useState("3, 2");
  const [rightText, setRightText] = useState("2");
  const left = parseShape(leftText);
  const right = parseShape(rightText);
  // shortcut: invalid shapes keep the last valid pair on screen.
  const [shapes, setShapes] = useState({ left: [3, 2], right: [2] });
  if (left && right && (left.join() !== shapes.left.join() || right.join() !== shapes.right.join())) {
    setShapes({ left, right });
  }
  const code = broadcastShapesCode(shapes.left, shapes.right);
  const recording = useDemoRecording(code);
  const frame = recording.state === "ready" ? recording.frames[recording.frames.length - 1] : undefined;

  return (
    <DemoFrame
      title="Do these shapes broadcast?"
      code={code}
      recording={recording}
      controls={
        <>
          {[
            { label: "Shape of a", value: leftText, set: setLeftText, ok: left !== null },
            { label: "Shape of b", value: rightText, set: setRightText, ok: right !== null },
          ].map((field) => (
            <label key={field.label} className="grid gap-1 text-xs text-subtle">
              {field.label}
              <input value={field.value} onChange={(event) => field.set(event.target.value)} className={`${FIELD} w-24`} aria-invalid={!field.ok} />
            </label>
          ))}
          <span className="text-xs text-subtle">
            {left && right ? "Try 3, 2 with 3, or 4, 1 with 3." : "Use 1 to 3 sizes from 1 to 6, like 3, 2."}
          </span>
        </>
      }
    >
      {frame ? (
        <div className="grid gap-2">
          <p className={`text-sm font-medium ${frame.status === "error" ? "text-danger" : "text-success"}`}>
            {frame.status === "error" ? "NumPy says no: these shapes do not broadcast." : "NumPy says yes: these shapes broadcast."}
          </p>
          <FrameVisualizer key={code} frame={frame} paused={false} speed={1.5} />
        </div>
      ) : null}
    </DemoFrame>
  );
}

/** Lesson 08: steps through `X * w + b` statement by statement, then sub-step by sub-step. */
export function XwbStepsDemo() {
  const recording = useDemoRecording(XWB_CODE);
  const frames = recording.state === "ready" ? recording.frames : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const frame = frames[Math.min(index, frames.length - 1)];
  const lines = XWB_CODE.split("\n");

  return (
    <DemoFrame
      title="Step through X * w + b"
      recording={recording}
      controls={
        <>
          <button type="button" className="btn" onClick={() => setIndex((value) => Math.max(value - 1, 0))} disabled={index === 0}>
            <SkipBack className="size-4" aria-hidden /> Step back
          </button>
          <button type="button" className="btn-primary" onClick={() => setIndex((value) => Math.min(value + 1, frames.length - 1))} disabled={frames.length === 0 || index >= frames.length - 1}>
            Step forward <SkipForward className="size-4" aria-hidden />
          </button>
          <button type="button" className="btn" onClick={() => setPaused((value) => !value)} disabled={!frame || frame.operations.length === 0}>
            {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />} {paused ? "Resume" : "Pause"}
          </button>
        </>
      }
    >
      {frame ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <pre className="overflow-x-auto rounded-md border border-line bg-surface py-2 font-mono text-xs leading-5" aria-label="Code, current step highlighted">
            {lines.map((line, number) => {
              const current = number + 1 >= frame.startLine && number + 1 <= frame.endLine;
              return (
                <div key={number} className={`flex gap-3 px-3 ${current ? "frame-highlight" : ""}`}>
                  <span className="w-4 select-none text-right text-subtle">{number + 1}</span>
                  <span>{line || " "}</span>
                </div>
              );
            })}
          </pre>
          <div className="grid content-start gap-3">
            <p className="text-xs text-subtle">
              Step {index + 1} of {frames.length}
            </p>
            <FrameVisualizer key={frame.index} frame={frame} paused={paused} speed={1} />
          </div>
          <div className="md:col-span-2">
            <ExecutionTimeline frames={frames} current={index} onSelect={setIndex} />
          </div>
        </div>
      ) : null}
    </DemoFrame>
  );
}
