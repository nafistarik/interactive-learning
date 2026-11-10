"use client";

import { useState } from "react";

import { axisRange, formatChartValue, type ChartPoint } from "@/features/visualization/charts";

const WIDTH = 320;
const HEIGHT = 120;
const PAD = { left: 44, right: 10, top: 10, bottom: 22 };

/**
 * One recorded number over loop iterations (R3): a 2px line, the selected iteration marked,
 * a crosshair tooltip on hover, and the values as a table for screen readers. A single
 * series, so the title names it and there is no legend.
 *
 * @param props.title - The variable name.
 * @param props.points - (iteration, value) points, from recorded iterations.
 * @param props.current - The selected iteration.
 * @param props.onSelect - Called with an iteration when the chart is clicked.
 */
export function LineChart({
  title,
  points,
  current,
  onSelect,
}: {
  title: string;
  points: ChartPoint[];
  current: number;
  onSelect: (iteration: number) => void;
}) {
  const [hover, setHover] = useState<ChartPoint | null>(null);
  const [xMin, xMax] = points.length > 1 ? [points[0].x, points[points.length - 1].x] : [0, 1];
  const [yMin, yMax] = axisRange(points.map((point) => point.y));
  const sx = (x: number) => PAD.left + ((x - xMin) / Math.max(xMax - xMin, 1)) * (WIDTH - PAD.left - PAD.right);
  const sy = (y: number) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * (HEIGHT - PAD.top - PAD.bottom);
  const nearest = (x: number) =>
    points.reduce((best, point) => (Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best), points[0]);
  const marker = points.length ? nearest(current) : null;
  const shown = hover ?? marker;
  const path = points.map((point, index) => `${index ? "L" : "M"}${sx(point.x).toFixed(1)},${sy(point.y).toFixed(1)}`).join("");
  const tableRows = points.filter((_, index) => index % Math.ceil(points.length / 12) === 0 || index === points.length - 1);

  /** Maps a pointer position to the nearest recorded point. */
  function pointAt(clientX: number, box: DOMRect): ChartPoint {
    const x = xMin + ((clientX - box.left) / box.width * WIDTH - PAD.left) / (WIDTH - PAD.left - PAD.right) * (xMax - xMin);
    return nearest(x);
  }

  return (
    <figure className="grid gap-1">
      <figcaption className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-mono font-medium text-fg">{title}</span>
        {shown ? (
          <span className="font-mono tabular-nums text-muted">
            iteration {shown.x}: {formatChartValue(shown.y)}
          </span>
        ) : null}
      </figcaption>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full cursor-crosshair touch-none select-none"
        role="img"
        aria-label={`${title} over ${points.length} recorded iterations, from ${formatChartValue(points[0]?.y ?? 0)} to ${formatChartValue(points.at(-1)?.y ?? 0)}`}
        onPointerMove={(event) => points.length && setHover(pointAt(event.clientX, event.currentTarget.getBoundingClientRect()))}
        onPointerLeave={() => setHover(null)}
        onClick={(event) => points.length && onSelect(pointAt(event.clientX, event.currentTarget.getBoundingClientRect()).x)}
      >
        {[yMin, (yMin + yMax) / 2, yMax].map((y) => (
          <g key={y}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={sy(y)} y2={sy(y)} stroke="var(--line)" strokeWidth={1} />
            <text x={PAD.left - 6} y={sy(y) + 3} textAnchor="end" fontSize={9} fill="var(--subtle)">
              {formatChartValue(y)}
            </text>
          </g>
        ))}
        <text x={PAD.left} y={HEIGHT - 6} fontSize={9} fill="var(--subtle)">
          {xMin}
        </text>
        <text x={WIDTH - PAD.right} y={HEIGHT - 6} fontSize={9} textAnchor="end" fill="var(--subtle)">
          {xMax}
        </text>
        <path d={path} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {hover ? (
          <line x1={sx(hover.x)} x2={sx(hover.x)} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="var(--line-strong)" strokeWidth={1} />
        ) : null}
        {marker ? (
          <circle cx={sx(marker.x)} cy={sy(marker.y)} r={4} fill="var(--chart-1)" stroke="var(--surface)" strokeWidth={2} />
        ) : null}
      </svg>
      <details className="text-xs text-subtle">
        <summary className="cursor-pointer">Values</summary>
        <table className="mt-1 font-mono tabular-nums">
          <thead>
            <tr>
              <th className="pr-4 text-left font-medium">iteration</th>
              <th className="text-left font-medium">{title}</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((point) => (
              <tr key={point.x}>
                <td className="pr-4">{point.x}</td>
                <td>{formatChartValue(point.y)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
