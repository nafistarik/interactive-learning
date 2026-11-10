"use client";

import { useState } from "react";

import { axisRange, formatChartValue } from "@/features/visualization/charts";

const WIDTH = 360;
const HEIGHT = 200;
const PAD = { left: 40, right: 12, top: 12, bottom: 24 };

/**
 * Data points and the model's recorded predictions at one iteration (R3 fit chart). Two
 * series, so a legend names both; points are 8px dots with a surface ring, predictions a 2px
 * line through the recorded (x, prediction) pairs, never computed here.
 *
 * @param props.x - Recorded inputs (one feature).
 * @param props.y - Recorded targets.
 * @param props.prediction - Recorded predictions for the same x, or `null`.
 * @param props.names - Variable names for the legend.
 */
export function FitChart({
  x,
  y,
  prediction,
  names,
}: {
  x: number[];
  y: number[];
  prediction: number[] | null;
  names: { x: string; y: string; prediction: string };
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [xMin, xMax] = axisRange(x);
  const [yMin, yMax] = axisRange([...y, ...(prediction ?? [])]);
  const sx = (value: number) => PAD.left + ((value - xMin) / (xMax - xMin)) * (WIDTH - PAD.left - PAD.right);
  const sy = (value: number) => PAD.top + (1 - (value - yMin) / (yMax - yMin)) * (HEIGHT - PAD.top - PAD.bottom);
  const order = x.map((_, index) => index).sort((a, b) => x[a] - x[b]);
  const line =
    prediction && prediction.length === x.length
      ? order.map((index, at) => `${at ? "L" : "M"}${sx(x[index]).toFixed(1)},${sy(prediction[index]).toFixed(1)}`).join("")
      : null;

  return (
    <figure className="grid gap-1">
      <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10" aria-hidden>
            <circle cx="5" cy="5" r="4" fill="var(--chart-1)" />
          </svg>
          data ({names.x}, {names.y})
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="14" height="10" aria-hidden>
            <line x1="0" y1="5" x2="14" y2="5" stroke="var(--chart-2)" strokeWidth="2" />
          </svg>
          {names.prediction}, recorded at this iteration
        </span>
        {hover !== null ? (
          <span className="font-mono tabular-nums">
            {names.x}={formatChartValue(x[hover])} · {names.y}={formatChartValue(y[hover])}
            {prediction ? ` · ${names.prediction}=${formatChartValue(prediction[hover])}` : ""}
          </span>
        ) : null}
      </figcaption>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={`${names.y} against ${names.x}, with the model's predictions`}>
        {[yMin, (yMin + yMax) / 2, yMax].map((value) => (
          <g key={value}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={sy(value)} y2={sy(value)} stroke="var(--line)" strokeWidth={1} />
            <text x={PAD.left - 6} y={sy(value) + 3} textAnchor="end" fontSize={9} fill="var(--subtle)">
              {formatChartValue(value)}
            </text>
          </g>
        ))}
        <text x={PAD.left} y={HEIGHT - 8} fontSize={9} fill="var(--subtle)">
          {formatChartValue(xMin)}
        </text>
        <text x={WIDTH - PAD.right} y={HEIGHT - 8} fontSize={9} textAnchor="end" fill="var(--subtle)">
          {formatChartValue(xMax)}
        </text>
        {line ? <path d={line} fill="none" stroke="var(--chart-2)" strokeWidth={2} strokeLinejoin="round" /> : null}
        {x.map((value, index) => (
          <g key={index} onPointerEnter={() => setHover(index)} onPointerLeave={() => setHover(null)}>
            <circle cx={sx(value)} cy={sy(y[index])} r={10} fill="transparent" />
            <circle cx={sx(value)} cy={sy(y[index])} r={4} fill="var(--chart-1)" stroke="var(--surface)" strokeWidth={2} />
          </g>
        ))}
      </svg>
    </figure>
  );
}
