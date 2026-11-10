"use client";

import { useState } from "react";

import type { ExecutionFrame, LoopRecord } from "@/features/execution/frames";
import { numericValues } from "@/features/visualization/broadcast";
import {
  numberSeries,
  numericWatched,
  watchedArray,
  type ChartPoint,
  type FitChartSpec,
} from "@/features/visualization/charts";
import { useCycle } from "@/features/visualization/use-cycle";

import { ArrayGrid } from "./ArrayGrid";
import { FitChart } from "./FitChart";
import { LineChart } from "./LineChart";

/** Time to play through all recorded iterations at 1×. */
const PLAY_MS = 4000;

/** A series that only counts iterations (a loop counter) is not worth a chart. */
function isCounter(points: ChartPoint[]): boolean {
  return points.length > 1 && points.every((point) => point.y - point.x === points[0].y - points[0].x);
}

/** Watched arrays whose shape stays the same, so one grid can follow them. */
function steadyArrays(loop: LoopRecord): string[] {
  const first = loop.iterations[0];
  const last = loop.iterations.at(-1);
  return loop.watched.filter((name) => {
    const a = first?.values[name];
    const b = last?.values[name];
    return a && b && "array" in a && "array" in b && a.array.shape.join() === b.array.shape.join();
  });
}

/**
 * A top-level loop (R3): the recorded iterations with a scrubber, a line chart per watched
 * number, watched arrays at the selected iteration, and the fit chart when declared. Plays
 * through the iterations; pausing, reduced motion (shows the last iteration) and clicking a
 * chart or the slider stop it there.
 *
 * @param props.frame - A frame with `operationType: "loop"`.
 * @param props.loop - Its loop record.
 * @param props.playing - Whether to play (not paused, motion allowed).
 * @param props.reducedMotion - Start at the last iteration and do not move.
 * @param props.speed - Playback speed.
 * @param props.chart - A fit chart to draw, from the exercise or demo.
 */
export function LoopView({
  frame,
  loop,
  playing,
  reducedMotion,
  speed,
  chart,
}: {
  frame: ExecutionFrame;
  loop: LoopRecord;
  playing: boolean;
  reducedMotion: boolean;
  speed: number;
  chart?: FitChartSpec;
}) {
  const count = loop.iterations.length;
  const [selected, setSelected] = useState<number | null>(null);
  const [auto] = useCycle(count, playing && selected === null, Math.max(20, PLAY_MS / Math.max(count, 1)) / speed);
  const index = selected ?? (reducedMotion ? count - 1 : auto);
  const current = loop.iterations[index];

  if (count === 0 || !current) {
    return <p className="text-sm text-muted">The loop body did not run.</p>;
  }

  const charts = numericWatched(loop)
    .map((name) => ({ name, points: numberSeries(loop, name) }))
    .filter((series) => !isCounter(series.points))
    .slice(0, 4);
  const arrays = steadyArrays(loop).slice(0, 3);
  const finalArray = (name: string) => {
    const snapshot = frame.variables.find((variable) => variable.name === name)?.array;
    return snapshot ? numericValues(snapshot) : null;
  };
  const fit = chart
    ? { x: finalArray(chart.x), y: finalArray(chart.y), prediction: watchedArray(current.values[chart.prediction]) }
    : null;

  /** Selects the recorded iteration closest to the given iteration number. */
  function selectIteration(iteration: number) {
    const closest = loop.iterations.reduce(
      (best, item, at) => (Math.abs(item.iteration - iteration) < Math.abs(loop.iterations[best].iteration - iteration) ? at : best),
      0,
    );
    setSelected(closest);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <p className="text-sm">
          The loop ran <span className="font-medium">{loop.total}</span> time{loop.total === 1 ? "" : "s"}.{" "}
          {loop.sampled ? (
            <span className="text-muted">
              Showing {count} evenly spaced recorded iterations, including the last.
            </span>
          ) : null}
        </p>
        <label className="grid gap-1 text-xs text-subtle">
          <span>
            Iteration <span className="font-mono tabular-nums text-fg">{current.iteration}</span> of {loop.total - 1}
          </span>
          <input
            type="range"
            min={0}
            max={count - 1}
            value={index}
            onChange={(event) => setSelected(Number(event.target.value))}
            className="accent-[var(--accent)]"
            aria-label="Loop iteration"
          />
        </label>
      </div>

      {fit && fit.x && fit.y && chart ? (
        <FitChart x={fit.x} y={fit.y} prediction={fit.prediction} names={chart} />
      ) : null}

      {charts.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {charts.map((series) => (
            <LineChart
              key={series.name}
              title={series.name}
              points={series.points}
              current={current.iteration}
              onSelect={selectIteration}
            />
          ))}
        </div>
      ) : null}

      {arrays.map((name) => {
        const value = current.values[name];
        return value && "array" in value ? (
          <ArrayGrid key={name} label={`${name} at iteration ${current.iteration}`} snapshot={value.array} tone="result" />
        ) : null;
      })}
    </div>
  );
}
