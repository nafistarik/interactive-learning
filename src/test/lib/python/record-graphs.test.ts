import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import type { ExecutionFrame } from "@/features/execution/frames";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";

import { loadTestPyodide } from "./load-test-pyodide";

/** A tiny autograd value in the R5 convention (data, grad, _prev, _op, label). */
const VALUE_CLASS = [
  "class Value:",
  "    def __init__(self, data, _prev=(), _op='', label=''):",
  "        self.data = data",
  "        self.grad = 0.0",
  "        self._prev = _prev",
  "        self._op = _op",
  "        self.label = label",
  "        self._backward = lambda: None",
  "    def __add__(self, other):",
  "        out = Value(self.data + other.data, (self, other), '+')",
  "        def _backward():",
  "            self.grad += out.grad",
  "            other.grad += out.grad",
  "        out._backward = _backward",
  "        return out",
  "    def __mul__(self, other):",
  "        out = Value(self.data * other.data, (self, other), '*')",
  "        def _backward():",
  "            self.grad += other.data * out.grad",
  "            other.grad += self.data * out.grad",
  "        out._backward = _backward",
  "        return out",
  "    def backward(self):",
  "        order, seen = [], set()",
  "        def build(v):",
  "            if v not in seen:",
  "                seen.add(v)",
  "                for child in v._prev:",
  "                    build(child)",
  "                order.append(v)",
  "        build(self)",
  "        self.grad = 1.0",
  "        for v in reversed(order):",
  "            v._backward()",
].join("\n");

/* R5 engine: autograd values are recorded as graphs, not as element-wise steps. */
describe("recording autograd graphs", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
    installRecorder(pyodide);
  }, 180_000);

  function frames(code: string): ExecutionFrame[] {
    const outcome = recordFrames(pyodide, code);
    if (!outcome.ok) {
      throw new Error(outcome.error);
    }
    return outcome.frames;
  }

  const CODE = [
    VALUE_CLASS,
    "a = Value(2.0, label='a')",
    "b = Value(-3.0, label='b')",
    "c = Value(10.0, label='c')",
    "e = a * b",
    "e.label = 'e'",
    "d = e + c",
    "d.label = 'd'",
    "d.backward()",
  ].join("\n");

  it("records Value arithmetic without element-wise steps", () => {
    const product = frames(CODE).find((frame) => frame.source === "e = a * b");
    expect(product?.status).toBe("success");
    expect(product?.operations).toEqual([]);
  });

  it("snapshots the graph with data, ops and edges, root first", () => {
    const afterSum = frames(CODE).find((frame) => frame.source === "d.label = 'd'");
    const graph = afterSum?.variables.find((variable) => variable.name === "d")?.graph;
    expect(graph?.nodes[0]).toEqual({ label: "d", data: 4, grad: 0, op: "+" });
    expect(graph?.nodes.map((node) => node.label).sort()).toEqual(["a", "b", "c", "d", "e"]);
    expect(graph?.edges).toHaveLength(4);
    expect(graph?.truncated).toBe(false);
  });

  it("shows the gradients after backward()", () => {
    const last = frames(CODE).at(-1);
    const graph = last?.variables.find((variable) => variable.name === "d")?.graph;
    const grads = Object.fromEntries(graph?.nodes.map((node) => [node.label, node.grad]) ?? []);
    expect(grads).toEqual({ d: 1, e: 1, c: 1, a: -3, b: 2 });
    expect(last?.variables.find((variable) => variable.name === "a")?.repr).toBe("Value(data=2.0, grad=-3.0)");
  });

  it("caps a large graph at 40 nodes and says so", () => {
    const code = [VALUE_CLASS, "total = Value(0.0)", "for i in range(60):", "    total = total + Value(1.0)"].join("\n");
    const graph = frames(code).at(-1)?.variables.find((variable) => variable.name === "total")?.graph;
    expect(graph?.nodes).toHaveLength(40);
    expect(graph?.truncated).toBe(true);
  });
});
