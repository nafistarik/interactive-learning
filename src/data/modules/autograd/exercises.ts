import type { Exercise } from "@/features/validation/types";

import { VALUE_ADD, VALUE_BACKWARD, VALUE_MUL, VALUE_TANH, valueClass } from "./value-class";

/** Exercise 32: the inputs of f = (a * b + c) * a, where a is used twice (lesson 02). */
const MUL_PRELUDE = ["a_data = 2.0", "b_data = -3.0", "c_data = 10.0"].join("\n");
const MUL_HIDDEN = ["a_data = -1.5", "b_data = 4.0", "c_data = 0.5"].join("\n");

/** `__mul__` with an empty `_backward`: the part the learner writes. */
const MUL_TODO = [
  "    def __mul__(self, other):",
  '        out = Value(self.data * other.data, (self, other), "*")',
  "        def _backward():",
  "            # Add each input's local gradient times out.grad to its grad.",
  "            pass",
  "        out._backward = _backward",
  "        return out",
].join("\n");

/** Builds f = (a * b + c) * a and runs it backwards by hand, as in lesson 02. */
const MUL_SCRIPT = [
  'a = Value(a_data, label="a")',
  'b = Value(b_data, label="b")',
  'c = Value(c_data, label="c")',
  "e = a * b",
  'e.label = "e"',
  "d = e + c",
  'd.label = "d"',
  "f = d * a",
  'f.label = "f"',
  "",
  "# Run the graph backwards by hand, from the output to the inputs.",
  "f.grad = 1.0",
  "f._backward()",
  "d._backward()",
  "e._backward()",
  "",
  "a_grad = a.grad",
  "b_grad = b.grad",
  "c_grad = c.grad",
  "print(a_grad, b_grad, c_grad)",
].join("\n");

const mulCode = (mul: string) => [valueClass(VALUE_ADD, mul), "", MUL_SCRIPT].join("\n");

/** Exercise 33: the inputs of L = (x * w + b) * (x * w + b) (lesson 03). */
const ORDER_PRELUDE = ["x_data = 2.0", "w_data = -0.5", "b_data = 3.0"].join("\n");
const ORDER_HIDDEN = ["x_data = -1.5", "w_data = 2.0", "b_data = 0.5"].join("\n");

/** `backward()` without the `seen` check: a reused value is listed, and run backwards, twice. */
const BACKWARD_BUG = VALUE_BACKWARD.replace(
  ["            if v not in seen:", "                seen.add(v)", "                for child in v._prev:", "                    build(child)", "                order.append(v)"].join("\n"),
  ["            seen.add(v)", "            for child in v._prev:", "                build(child)", "            order.append(v)"].join("\n"),
);

const ORDER_SCRIPT = [
  'x = Value(x_data, label="x")',
  'w = Value(w_data, label="w")',
  'b = Value(b_data, label="b")',
  "xw = x * w",
  'xw.label = "xw"',
  "z = xw + b",
  'z.label = "z"',
  "L = z * z",
  'L.label = "L"',
  "L.backward()",
  "",
  "x_grad = x.grad",
  "w_grad = w.grad",
  "b_grad = b.grad",
  "print(x_grad, w_grad, b_grad)",
].join("\n");

const orderCode = (backward: string) => [valueClass(VALUE_ADD, VALUE_MUL, backward), "", ORDER_SCRIPT].join("\n");

/** The chain rule by hand for L = z * z with z = x * w + b. */
const ORDER_REFERENCE = ["z = x_data * w_data + b_data", "x_grad = 2 * z * w_data", "w_grad = 2 * z * x_data", "b_grad = 2 * z"].join(
  "\n",
);

/** Exercise 34: a neuron's inputs and parameters (lesson 04). */
const NEURON_PRELUDE = ["x1_data = 2.0", "x2_data = 0.5", "w1_data = -0.5", "w2_data = 1.5", "b_data = 0.1"].join("\n");
const NEURON_HIDDEN = ["x1_data = -1.0", "x2_data = 2.0", "w1_data = 0.3", "w2_data = -0.4", "b_data = 0.2"].join("\n");

const TANH_TODO = [
  "    def tanh(self):",
  "        # Return a new Value holding math.tanh(self.data), with self as its only",
  '        # input and the op "tanh". Its _backward adds (1 - t * t) * out.grad',
  "        # to self.grad, where t is the tanh computed in the forward pass.",
  "        pass",
].join("\n");

const NEURON_INPUTS = [
  'x1 = Value(x1_data, label="x1")',
  'x2 = Value(x2_data, label="x2")',
  'w1 = Value(w1_data, label="w1")',
  'w2 = Value(w2_data, label="w2")',
  'b = Value(b_data, label="b")',
].join("\n");

const neuronClass = (tanh: string) => ["import math", "", valueClass(VALUE_ADD, VALUE_MUL, tanh, VALUE_BACKWARD)].join("\n");

const NEURON_STARTER = [
  neuronClass(TANH_TODO),
  "",
  NEURON_INPUTS,
  "",
  "# Build n = w1 * x1 + w2 * x2 + b and o = n.tanh(), then call o.backward().",
  "",
  "# Store o.data in out_data and the gradients in w1_grad, w2_grad and b_grad.",
  "",
].join("\n");

const NEURON_SOLUTION = [
  neuronClass(VALUE_TANH),
  "",
  NEURON_INPUTS,
  "n = w1 * x1 + w2 * x2 + b",
  'n.label = "n"',
  "o = n.tanh()",
  'o.label = "o"',
  "o.backward()",
  "",
  "out_data = o.data",
  "w1_grad = w1.grad",
  "w2_grad = w2.grad",
  "b_grad = b.grad",
].join("\n");

/** The neuron's output and gradients from the chain rule, without autograd. */
const NEURON_REFERENCE = [
  "import math",
  "t = math.tanh(w1_data * x1_data + w2_data * x2_data + b_data)",
  "local = 1 - t * t",
].join("\n");

/** Exercises of Module 2.3 (R5 brief): two builds and one bug hunt. */
export const AUTOGRAD_EXERCISES: readonly Exercise[] = [
  {
    id: "ex32",
    lessonId: "02",
    title: "The backward rule of multiplication",
    objective: "Complete the _backward of __mul__ so that both inputs of a product receive their gradients.",
    problem:
      "The Value class below can add and multiply, and + already passes its gradient back. Fill in the _backward of __mul__: each input's grad grows by the other input's data times out.grad. The script builds f = (a * b + c) * a from the numbers given above the editor, runs it backwards by hand and stores a_grad, b_grad and c_grad. Note that a is used twice.",
    starterCode: mulCode(MUL_TODO),
    prelude: MUL_PRELUDE,
    hint: "Inside _backward: self.grad += other.data * out.grad, then other.grad += self.data * out.grad. Use += so that a, used twice, collects both shares.",
    runs: [
      { prelude: MUL_PRELUDE, reference: MUL_PRELUDE },
      { prelude: MUL_HIDDEN, reference: MUL_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "a_grad", expression: "2 * a_data * b_data + c_data" },
      { kind: "result", name: "b_grad", expression: "a_data * a_data" },
      { kind: "result", name: "c_grad", expression: "a_data" },
    ],
    solution: mulCode(VALUE_MUL),
  },
  {
    id: "ex33",
    lessonId: "03",
    type: "bug-hunt",
    title: "Bug hunt: a value used twice",
    objective: "Fix backward() so that a value used twice is run backwards once, and the gradients match the chain rule.",
    problem:
      "The script computes L = z * z with z = x * w + b and calls L.backward(). The chain rule gives x.grad = 2 * z * w, w.grad = 2 * z * x and b.grad = 2 * z, but the printed gradients are too large. The + and * rules are correct; the bug is in how backward() builds its order.",
    starterCode: orderCode(BACKWARD_BUG),
    prelude: ORDER_PRELUDE,
    hint: "z appears twice in L = z * z, so build visits it twice and appends it, and everything below it, twice. Only visit a node that is not in seen yet: wrap the body of build in if v not in seen:.",
    runs: [
      { prelude: ORDER_PRELUDE, reference: `${ORDER_PRELUDE}\n${ORDER_REFERENCE}` },
      { prelude: ORDER_HIDDEN, reference: `${ORDER_HIDDEN}\n${ORDER_REFERENCE}` },
    ],
    checks: [
      { kind: "result", name: "x_grad", expression: "x_grad" },
      { kind: "result", name: "w_grad", expression: "w_grad" },
      { kind: "result", name: "b_grad", expression: "b_grad" },
    ],
    solution: orderCode(VALUE_BACKWARD),
  },
  {
    id: "ex34",
    lessonId: "04",
    title: "A neuron in autograd",
    objective: "Add tanh to Value, build the neuron tanh(w1*x1 + w2*x2 + b) and compute its gradients with backward().",
    problem:
      "The numbers above the editor are a neuron's inputs x1, x2, its weights w1, w2 and its bias b. Implement the tanh method of Value: the forward value and its _backward, with local gradient 1 - t * t. Then build n = w1 * x1 + w2 * x2 + b and o = n.tanh(), call o.backward(), and store out_data, w1_grad, w2_grad and b_grad.",
    starterCode: NEURON_STARTER,
    prelude: NEURON_PRELUDE,
    hint: "In tanh: t = math.tanh(self.data), out = Value(t, (self,), \"tanh\"), and a _backward with self.grad += (1 - t * t) * out.grad; attach it with out._backward = _backward and return out. Then out_data = o.data and w1_grad = w1.grad, and so on.",
    runs: [
      { prelude: NEURON_PRELUDE, reference: `${NEURON_PRELUDE}\n${NEURON_REFERENCE}` },
      { prelude: NEURON_HIDDEN, reference: `${NEURON_HIDDEN}\n${NEURON_REFERENCE}` },
    ],
    checks: [
      { kind: "result", name: "out_data", expression: "t", tolerance: 1e-6 },
      { kind: "result", name: "w1_grad", expression: "local * x1_data", tolerance: 1e-6 },
      { kind: "result", name: "w2_grad", expression: "local * x2_data", tolerance: 1e-6 },
      { kind: "result", name: "b_grad", expression: "local", tolerance: 1e-6 },
    ],
    solution: NEURON_SOLUTION,
  },
];
