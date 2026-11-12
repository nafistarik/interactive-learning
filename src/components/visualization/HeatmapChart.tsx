import type { ArraySnapshot } from "@/features/execution/frames";
import { numericValues } from "@/features/visualization/broadcast";
import { formatChartValue } from "@/features/visualization/charts";

const CELL = 44;
const MAX = 8;

/**
 * A recorded 2D array as a heatmap (R6): one hue, darker for larger values, each cell with
 * its number, rows and columns labelled. Shows nothing it cannot draw honestly (not 2D, too
 * large, truncated or non-numeric) and says so.
 *
 * @param props.name - The variable name.
 * @param props.snapshot - The recorded array.
 * @param props.rowLabels - Labels for rows (authored).
 * @param props.colLabels - Labels for columns (authored).
 */
export function HeatmapChart({
  name,
  snapshot,
  rowLabels,
  colLabels,
}: {
  name: string;
  snapshot: ArraySnapshot;
  rowLabels?: readonly string[];
  colLabels?: readonly string[];
}) {
  const values = numericValues(snapshot);
  const [rows, cols] = snapshot.shape;
  if (!values || snapshot.shape.length !== 2 || rows > MAX || cols > MAX) {
    return (
      <p className="text-sm text-muted">
        {name} has shape ({snapshot.shape.join(", ")}); the heatmap draws numeric 2D arrays up to {MAX} × {MAX}.
      </p>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const shade = (value: number) => (max === min ? 0.5 : 0.08 + ((value - min) / (max - min)) * 0.82);
  const labelW = rowLabels ? 64 : 0;
  const labelH = colLabels ? 22 : 0;
  const width = labelW + cols * CELL;
  const height = labelH + rows * CELL;

  return (
    <figure className="grid gap-2">
      <figcaption className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="font-mono font-medium text-fg">{name}</span>
        <span className="flex items-center gap-1.5">
          {formatChartValue(min)}
          <svg width="60" height="8" aria-hidden>
            <defs>
              <linearGradient id={`heat-${name}`}>
                <stop offset="0" stopColor="var(--chart-1)" stopOpacity="0.08" />
                <stop offset="1" stopColor="var(--chart-1)" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect width="60" height="8" rx="2" fill={`url(#heat-${name})`} />
          </svg>
          {formatChartValue(max)}
        </span>
      </figcaption>
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${name}, ${rows} by ${cols}: ${Array.from({ length: rows }, (_, r) =>
            `${rowLabels?.[r] ?? `row ${r}`}: ${values.slice(r * cols, r * cols + cols).map(formatChartValue).join(", ")}`,
          ).join("; ")}`}
        >
          {colLabels?.slice(0, cols).map((label, c) => (
            <text key={c} x={labelW + c * CELL + CELL / 2} y={14} textAnchor="middle" fontSize={10} fill="var(--muted)">
              {label}
            </text>
          ))}
          {rowLabels?.slice(0, rows).map((label, r) => (
            <text key={r} x={labelW - 6} y={labelH + r * CELL + CELL / 2 + 3} textAnchor="end" fontSize={10} fill="var(--muted)">
              {label}
            </text>
          ))}
          {values.map((value, index) => {
            const r = Math.floor(index / cols);
            const c = index % cols;
            const opacity = shade(value);
            return (
              <g key={index}>
                <rect
                  x={labelW + c * CELL + 1}
                  y={labelH + r * CELL + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={4}
                  fill="var(--chart-1)"
                  fillOpacity={opacity}
                >
                  <title>{`${rowLabels?.[r] ?? r}, ${colLabels?.[c] ?? c}: ${value}`}</title>
                </rect>
                <text
                  x={labelW + c * CELL + CELL / 2}
                  y={labelH + r * CELL + CELL / 2 + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="var(--font-geist-mono)"
                  fill={opacity > 0.55 ? "var(--surface)" : "var(--fg)"}
                >
                  {formatChartValue(value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
