import type { ArraySnapshot } from "@/features/execution/frames";
import { gridLayers } from "@/features/visualization/broadcast";

/** Largest grid drawn per layer, and largest number of layers (brief Part 7.9). */
const MAX_CELLS = 8;
const MAX_LAYERS = 4;

/** Colour role of an array in the view (brief Part 8): input, weight or result. */
export type ArrayTone = "input" | "weight" | "result";

const TONE_CLASSES: Record<ArrayTone, string> = {
  input: "border-tone-input bg-tone-input-soft",
  weight: "border-tone-weight bg-tone-weight-soft",
  result: "border-tone-result bg-tone-result-soft",
};

/**
 * Formats a shape the way Python prints it: `(3, 2)` and `(2,)` for one axis.
 *
 * @param shape - The shape.
 * @returns The formatted shape.
 */
export function formatShape(shape: number[]): string {
  if (shape.length === 1) {
    return `(${shape[0]},)`;
  }
  return `(${shape.join(", ")})`;
}

/**
 * Draws an array as a row (1D), a grid (2D) or stacked layers (3D), with its shape. Shows at
 * most 8 by 8 cells and 4 layers, and says when it is showing part of the array.
 *
 * @param props.label - Name shown above the array.
 * @param props.snapshot - The array to draw.
 * @param props.tone - Colour role of the array.
 * @param props.highlight - Flat (row-major) 0/1 marks of cells to highlight, from a frame.
 * @param props.showIndices - Show each cell's position under it (1D arrays).
 */
export function ArrayGrid({
  label,
  snapshot,
  tone,
  highlight,
  showIndices = false,
}: {
  label: string;
  snapshot: ArraySnapshot;
  tone: ArrayTone;
  highlight?: number[];
  showIndices?: boolean;
}) {
  const { layers } = gridLayers(snapshot);
  const shownLayers = layers.slice(0, MAX_LAYERS);
  const cellsTruncated = layers.some(
    (rows) => rows.length > MAX_CELLS || rows.some((row) => row.length > MAX_CELLS),
  );
  const partial = snapshot.truncated || cellsTruncated || layers.length > MAX_LAYERS;
  const size = snapshot.shape.reduce((product, axis) => product * axis, 1);

  return (
    <figure className={`rounded-md border p-3 ${TONE_CLASSES[tone]}`}>
      <figcaption className="mb-2 flex flex-wrap items-baseline gap-x-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-muted">
          shape {formatShape(snapshot.shape)}
        </span>
        <span className="text-subtle">
          ndim {snapshot.shape.length} · size {size} · {snapshot.dtype}
        </span>
      </figcaption>

      <div className="flex flex-wrap gap-3">
        {shownLayers.map((rows, layer) => (
          <div key={layer} className="grid gap-1 font-mono text-sm">
            {shownLayers.length > 1 ? (
              <span className="text-xs text-subtle">layer {layer}</span>
            ) : null}
            {rows.slice(0, MAX_CELLS).map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.slice(0, MAX_CELLS).map((cell, cellIndex) => {
                  const flatIndex = (layer * rows.length + rowIndex) * row.length + cellIndex;
                  const marked = highlight?.[flatIndex] === 1;
                  return (
                    <span key={cellIndex} className="grid justify-items-center gap-0.5">
                      <span
                        className={`min-w-9 rounded border px-2 py-1 text-center tabular-nums transition-colors ${
                          marked
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-line-strong bg-surface"
                        }`}
                      >
                        {String(cell)}
                      </span>
                      {showIndices ? <span className="text-[10px] text-subtle">[{cellIndex}]</span> : null}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {partial ? (
        <p className="mt-2 text-xs text-subtle">
          Showing part of a larger array (up to 8 × 8 cells and 4 layers).
        </p>
      ) : null}
    </figure>
  );
}
