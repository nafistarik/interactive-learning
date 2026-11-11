import type { AutogradGraph } from "@/features/execution/frames";
import { formatChartValue } from "@/features/visualization/charts";
import { layoutGraph } from "@/features/visualization/graph";

const BOX_W = 124;
const BOX_H = 54;
const GAP_X = 44;
const GAP_Y = 14;

/** A node value as text: a short number, or a dash when it is not a number. */
function show(value: number | string | null): string {
  return typeof value === "number" ? formatChartValue(value) : (value ?? "–");
}

/**
 * An autograd value's graph (R5): inputs on the left, the output on the right, each value with
 * its label, `data` and `grad` (accented when non-zero) and the operation that produced it.
 * All numbers are recorded values.
 *
 * @param props.name - The variable the graph belongs to.
 * @param props.graph - The recorded graph.
 */
export function GraphView({ name, graph }: { name: string; graph: AutogradGraph }) {
  const { places, columns, rows } = layoutGraph(graph);
  const width = columns * (BOX_W + GAP_X) - GAP_X + 8;
  const height = rows * (BOX_H + GAP_Y) - GAP_Y + 8;
  const x = (index: number) => 4 + places[index].column * (BOX_W + GAP_X);
  const y = (index: number) => 4 + places[index].row * (BOX_H + GAP_Y);

  return (
    <figure className="grid gap-2">
      <figcaption className="text-sm">
        <span className="font-mono font-medium">{name}</span>
        <span className="text-muted">
          {" "}
          and the values it was computed from{graph.truncated ? " (first 40 shown)" : ""}
        </span>
      </figcaption>
      <div className="overflow-x-auto rounded-card border border-line bg-surface p-2">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Computation graph of ${name}: ${graph.nodes
            .map((node) => `${node.label || "value"} data ${show(node.data)} grad ${show(node.grad)}`)
            .join("; ")}`}
        >
          {graph.edges.map(([input, output]) => (
            <line
              key={`${input}-${output}`}
              x1={x(input) + BOX_W}
              y1={y(input) + BOX_H / 2}
              x2={x(output)}
              y2={y(output) + BOX_H / 2}
              stroke="var(--line-strong)"
              strokeWidth={1.5}
            />
          ))}
          {graph.nodes.map((node, index) => {
            const hasGrad = typeof node.grad === "number" && node.grad !== 0;
            return (
              <g key={index} transform={`translate(${x(index)}, ${y(index)})`}>
                <rect
                  width={BOX_W}
                  height={BOX_H}
                  rx={6}
                  fill="var(--surface-2)"
                  stroke={index === 0 ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={index === 0 ? 2 : 1}
                />
                <text x={8} y={15} fontSize={11} fontFamily="var(--font-geist-mono)" fill="var(--fg)" fontWeight={600}>
                  {node.label || "·"}
                  {node.op ? <tspan fill="var(--subtle)" fontWeight={400}>{`  (${node.op})`}</tspan> : null}
                </text>
                <text x={8} y={32} fontSize={11} fontFamily="var(--font-geist-mono)" fill="var(--muted)">
                  data {show(node.data)}
                </text>
                <text
                  x={8}
                  y={47}
                  fontSize={11}
                  fontFamily="var(--font-geist-mono)"
                  fill={hasGrad ? "var(--accent)" : "var(--subtle)"}
                  fontWeight={hasGrad ? 600 : 400}
                >
                  grad {show(node.grad)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
