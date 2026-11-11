import type { LessonContent } from "@/features/content/types";

import { VALUE_ADD, VALUE_BACKWARD, VALUE_MUL, valueClass } from "../value-class";

/** The full class of this lesson: `+`, `*` and `backward()`. */
const VALUE_03 = valueClass(VALUE_ADD, VALUE_MUL, VALUE_BACKWARD);

/** The lesson's graph, `L = (a * b + c) * f`. */
const GRAPH_03 = [
  'a = Value(2.0, label="a")',
  'b = Value(-3.0, label="b")',
  'c = Value(10.0, label="c")',
  'f = Value(-2.0, label="f")',
  "e = a * b",
  'e.label = "e"',
  "d = e + c",
  'd.label = "d"',
  "L = d * f",
  'L.label = "L"',
].join("\n");

/** The demo's `backward()`, with the visiting order as a placeholder. */
const DEMO_BACKWARD = VALUE_BACKWARD.replace("for v in reversed(order):", "for v in {{visit}}:");

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "`backward()` lists the graph's nodes so that every node comes after its inputs, then calls each `_backward` in reverse. One call fills in every gradient, and they match the chain rule by hand.",
  estimatedMinutes: 18,
  sections: [
    {
      title: "What a topological order is",
      blocks: [
        {
          kind: "text",
          text: "A topological order of a graph is a list of all its nodes in which every node comes after all of its inputs. Read in reverse, every node comes before its inputs: the output first, the inputs last.",
        },
        {
          kind: "note",
          text: "For `L = (a * b + c) * f`, one topological order is `a, b, e, c, d, f, L`. Reversed, it starts at `L`, the node whose gradient you know is `1.0`.",
        },
      ],
    },
    {
      title: "Why the order matters",
      blocks: [
        {
          kind: "text",
          text: "A node's `_backward` passes on its own `out.grad`. If it runs before every use of the node has added its share, it passes on an incomplete gradient, and nothing corrects it later.",
        },
        {
          kind: "text",
          text: "In lesson 02 you chose the order by hand for one graph. Reverse topological order works for any graph: when a node's turn comes, every node that uses it has already run.",
        },
      ],
    },
    {
      title: "Building the order with depth-first search",
      blocks: [
        {
          kind: "text",
          text: "Depth-first search visits a node by first visiting each of its children, then appending the node itself, so every node lands after its inputs. The function `build` calls itself on the children; a function that calls itself is called recursive.",
        },
        {
          kind: "text",
          text: "The set `seen` remembers visited nodes. Without it, a value used twice would be appended twice, and its `_backward` would pass its gradient on twice.",
        },
        {
          kind: "code",
          code: [
            VALUE_03,
            "",
            GRAPH_03,
            "",
            "order = []",
            "seen = set()",
            "def build(v):",
            "    if v not in seen:",
            "        seen.add(v)",
            "        for child in v._prev:",
            "            build(child)",
            "        order.append(v)",
            "",
            "build(L)",
            "print([v.label for v in order])",
          ].join("\n"),
          output: "['a', 'b', 'e', 'c', 'd', 'f', 'L']",
        },
      ],
    },
    {
      title: "backward(): every gradient in one call",
      blocks: [
        {
          kind: "text",
          text: "The method `backward()` puts it together: build the order from the output, set the output's `grad` to `1.0`, then call `_backward` on every node in reverse order.",
        },
        {
          kind: "code",
          code: [VALUE_03, "", GRAPH_03, "", "L.backward()", "print(a.grad, b.grad, c.grad, f.grad)", "print(e.grad, d.grad)"].join(
            "\n",
          ),
          output: ["6.0 -4.0 -2.0 4.0", "-2.0 -2.0"].join("\n"),
        },
        {
          kind: "text",
          text: "By hand with the chain rule, `L = (a * b + c) * f` has the slopes `b * f = 6`, `a * f = -4`, `f = -2` for `c`, and `a * b + c = 4` for `f`. `backward()` found all four, plus the intermediate ones.",
        },
        {
          kind: "text",
          text: "It works when values are reused, too. For `y = x * x + x`, the slope is `2 * x + 1`, which is `7` at `x = 3`.",
        },
        {
          kind: "code",
          code: [VALUE_03, "", 'x = Value(3.0, label="x")', "y = x * x + x", "y.backward()", "print(x.grad)"].join("\n"),
          output: "7.0",
        },
        {
          kind: "note",
          text: "Gradients keep adding up: calling `backward()` a second time on the same graph doubles every input's `grad`. Before a new backward pass, set each `grad` back to `0.0`.",
        },
      ],
    },
    {
      title: "Try it: visit order and reused values",
      blocks: [
        {
          kind: "text",
          text: "Choose a calculation and the order in which `backward()` visits the nodes. `hand` holds the gradients from the chain rule by hand; `diff` is all zeros only when the order is reversed.",
        },
        {
          kind: "playground",
          demo: {
            title: "backward() against the hand gradients",
            controls: [
              {
                type: "select",
                name: "expr",
                label: "Calculation",
                options: [
                  { label: "L = a * b + c", value: "L = a * b + c\nhand = [b.data, a.data, 1.0]" },
                  {
                    label: "L = a * b + b * c (b used twice)",
                    value: "L = a * b + b * c\nhand = [b.data, a.data + c.data, b.data]",
                  },
                  {
                    label: "L = (a * b + c) * a (a used twice)",
                    value: "L = (a * b + c) * a\nhand = [2 * a.data * b.data + c.data, a.data * a.data, a.data]",
                  },
                ],
              },
              {
                type: "select",
                name: "visit",
                label: "Visit order",
                options: [
                  { label: "reversed(order)", value: "reversed(order)" },
                  { label: "order (forward, wrong)", value: "order" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "",
              valueClass(VALUE_ADD, VALUE_MUL, DEMO_BACKWARD),
              "",
              'a = Value(2.0, label="a")',
              'b = Value(-3.0, label="b")',
              'c = Value(10.0, label="c")',
              "{{expr}}",
              'L.label = "L"',
              "L.backward()",
              "",
              "grads = np.array([a.grad, b.grad, c.grad])",
              "diff = grads - np.array(hand)",
            ].join("\n"),
          },
        },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "A topological order lists every node after its inputs; depth-first search builds one.",
            "`seen` keeps a reused value from being listed, and run backwards, twice.",
            "`backward()` sets the output's `grad` to `1.0` and calls `_backward` in reverse order.",
            "The result matches the chain rule by hand, for every node at once.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "autograd-03-q1",
      question: "Which list is a topological order for `e = a * b` then `d = e + c`?",
      options: ["`d, e, c, a, b`", "`a, b, e, c, d`", "`e, a, b, c, d`", "`c, d, a, b, e`"],
      answer: 1,
      explanation: "Every node must come after its inputs: `e` after `a` and `b`, and `d` after `e` and `c`.",
    },
    {
      id: "autograd-03-q2",
      question: "Why does `backward()` call `_backward` in reverse topological order?",
      options: [
        "So every node has received all of its gradient before it passes it on",
        "Because the forward pass must be repeated backwards",
        "To visit the inputs before the output",
      ],
      answer: 0,
      explanation: "In reverse order, every node that uses a value runs first, so the value's `grad` is complete when its own turn comes.",
    },
    {
      id: "autograd-03-q3",
      question: "What does `backward()` set before it walks the graph?",
      options: ["Every `grad` to `1.0`", "The output's `data` to `0.0`", "The output's `grad` to `1.0`"],
      answer: 2,
      explanation: "The slope of the output with respect to itself is `1`; every other gradient is built from it.",
    },
  ],
};
