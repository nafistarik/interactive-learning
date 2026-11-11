import { describe, expect, it } from "vitest";

import type { AutogradGraph } from "@/features/execution/frames";
import { layoutGraph } from "@/features/visualization/graph";

const node = (label: string) => ({ label, data: 0, grad: 0, op: "" });

describe("layoutGraph", () => {
  it("puts inputs left of what they feed and the output last", () => {
    // d = e + c, e = a * b  →  nodes: d, e, c, a, b
    const graph: AutogradGraph = {
      nodes: ["d", "e", "c", "a", "b"].map(node),
      edges: [
        [1, 0],
        [2, 0],
        [3, 1],
        [4, 1],
      ],
      truncated: false,
    };
    const { places, columns, rows } = layoutGraph(graph);
    expect(columns).toBe(3);
    expect(places[0].column).toBe(2);
    expect(places[1].column).toBe(1);
    expect(places[2].column).toBe(1);
    expect(places[3].column).toBe(0);
    expect(rows).toBe(2);
  });

  it("places a value used at two depths at the deepest one", () => {
    // out = a * (a + b): a feeds both the sum and the product
    const graph: AutogradGraph = {
      nodes: ["out", "a", "s", "b"].map(node),
      edges: [
        [1, 0],
        [2, 0],
        [1, 2],
        [3, 2],
      ],
      truncated: false,
    };
    expect(layoutGraph(graph).places[1].column).toBe(0);
  });

  it("handles a single value", () => {
    expect(layoutGraph({ nodes: [node("x")], edges: [], truncated: false })).toEqual({
      places: [{ column: 0, row: 0 }],
      columns: 1,
      rows: 1,
    });
  });
});
