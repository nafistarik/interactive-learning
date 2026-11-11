import type { AutogradGraph } from "@/features/execution/frames";

/** Where one node of an autograd graph is drawn: its column (0 = inputs) and row. */
export interface GraphPlacement {
  column: number;
  row: number;
}

/**
 * Lays out a graph by distance from the output: the output (node 0) in the last column, each
 * input one column further left than the furthest value it feeds. Rows follow node order.
 *
 * @param graph - The recorded graph.
 * @returns One placement per node, and the column and row counts.
 */
export function layoutGraph(graph: AutogradGraph): { places: GraphPlacement[]; columns: number; rows: number } {
  const depth: number[] = graph.nodes.map((_, index) => (index === 0 ? 0 : -1));
  // Longest path from the output; edges are [input, output], so walk them until nothing changes.
  for (let pass = 0; pass < graph.nodes.length; pass++) {
    let changed = false;
    for (const [input, output] of graph.edges) {
      if (depth[output] >= 0 && depth[input] < depth[output] + 1) {
        depth[input] = depth[output] + 1;
        changed = true;
      }
    }
    if (!changed) {
      break;
    }
  }
  const maxDepth = Math.max(0, ...depth);
  const rowsUsed: number[] = [];
  const places = depth.map((value) => {
    const column = maxDepth - Math.max(value, 0);
    const row = rowsUsed[column] ?? 0;
    rowsUsed[column] = row + 1;
    return { column, row };
  });
  return { places, columns: maxDepth + 1, rows: Math.max(1, ...rowsUsed.filter((n) => n !== undefined)) };
}
