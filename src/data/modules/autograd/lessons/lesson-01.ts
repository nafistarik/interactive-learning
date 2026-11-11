import type { LessonContent } from "@/features/content/types";

/** The lesson's first `Value`: it stores a number and how it was made, no gradients yet. */
const VALUE_01 = [
  "class Value:",
  '    def __init__(self, data, _prev=(), _op="", label=""):',
  "        self.data = data",
  "        self.grad = 0.0",
  "        self._prev = _prev",
  "        self._op = _op",
  "        self.label = label",
  "",
  "    def __add__(self, other):",
  '        return Value(self.data + other.data, (self, other), "+")',
  "",
  "    def __mul__(self, other):",
  '        return Value(self.data * other.data, (self, other), "*")',
].join("\n");

/** The graph of `L = (a * b + c) * f`, with a label on every node. */
const GRAPH_01 = [
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

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A `Value` holds one number and remembers the inputs and the operation that produced it. Chaining operations on values builds a computation graph you can walk and see.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a Value is",
      blocks: [
        {
          kind: "text",
          text: "A `Value` is a small object that holds one number in `data` and a gradient in `grad`, which starts at `0.0`. When you combine two values with `+` or `*`, the result is a new `Value` that also remembers where it came from.",
        },
        {
          kind: "note",
          text: "A computation graph is the record of a calculation: each value is a node, and an arrow goes from every input of an operation to its result. The inputs a node was made from are its children.",
        },
      ],
    },
    {
      title: "Why the calculation must remember itself",
      blocks: [
        {
          kind: "text",
          text: "In Module 2.2 you found gradients by walking back through a calculation with the chain rule, by hand. To do that in code, the program needs the same map: which inputs made each value, and with which operation.",
        },
        {
          kind: "text",
          text: "If every result keeps that map, one function can walk any calculation backwards and fill in every gradient. This module builds that engine, called autograd (automatic gradients), in about 40 lines.",
        },
      ],
    },
    {
      title: "A class with operator methods",
      blocks: [
        {
          kind: "text",
          text: "`class Value:` defines a new type of object. Its `__init__` method runs when you write `Value(2.0)`; `self` is the new object, and `self.data = data` stores a number on it as an attribute.",
        },
        {
          kind: "text",
          text: "Python turns `a + b` into the method call `a.__add__(b)` and `a * b` into `a.__mul__(b)`. Each method returns a new `Value` whose `_prev` is the tuple of its two inputs and whose `_op` is the operation's symbol.",
        },
        {
          kind: "code",
          code: [
            VALUE_01,
            "",
            'a = Value(2.0, label="a")',
            'b = Value(-3.0, label="b")',
            "e = a * b",
            "print(e.data)",
            "print(e._op)",
            "print([child.label for child in e._prev])",
          ].join("\n"),
          output: ["-6.0", "*", "['a', 'b']"].join("\n"),
        },
        {
          kind: "text",
          text: "`e` is a `Value` like `a` and `b`, so it can be combined again. Its `_prev` holds the very objects `a` and `b`, not copies of their numbers.",
        },
      ],
    },
    {
      title: "Walking a labelled graph",
      blocks: [
        {
          kind: "text",
          text: "Here is the calculation `L = (a * b + c) * f`, one operation per line. A result has no label until you give it one, so each line sets `label` for the graph to read well.",
        },
        {
          kind: "text",
          text: "The function `show` prints a node, then calls itself on each child with more indentation. It walks from the output back to the inputs, the direction the gradients will flow.",
        },
        {
          kind: "code",
          code: [
            VALUE_01,
            "",
            GRAPH_01,
            "",
            "def show(v, depth=0):",
            '    print("  " * depth + v.label, v.data, v._op or "input")',
            "    for child in v._prev:",
            "        show(child, depth + 1)",
            "",
            "show(L)",
          ].join("\n"),
          output: [
            "L -8.0 *",
            "  d 4.0 +",
            "    e -6.0 *",
            "      a 2.0 input",
            "      b -3.0 input",
            "    c 10.0 input",
            "  f -2.0 input",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "Inputs have an empty `_prev` and no operation; every other node names its operation and its children. In Practice, the graph view draws the same structure after every line, with `data` and `grad` on each node.",
        },
      ],
    },
    {
      title: "Try it: build a graph",
      blocks: [
        {
          kind: "text",
          text: "Choose the last operation and the value of `f`. The last lines compute the same numbers with plain floats and compare them with the graph's `data`, so `same` is all true.",
        },
        {
          kind: "playground",
          demo: {
            title: "A graph that remembers",
            controls: [
              {
                type: "select",
                name: "op",
                label: "Last operation",
                options: [
                  { label: "L = d * f", value: "*" },
                  { label: "L = d + f", value: "+" },
                ],
              },
              {
                type: "select",
                name: "f",
                label: "f",
                options: [
                  { label: "-2.0", value: "-2.0" },
                  { label: "3.0", value: "3.0" },
                  { label: "0.5", value: "0.5" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "",
              VALUE_01,
              "",
              'a = Value(2.0, label="a")',
              'b = Value(-3.0, label="b")',
              'c = Value(10.0, label="c")',
              'f = Value({{f}}, label="f")',
              "e = a * b",
              'e.label = "e"',
              "d = e + c",
              'd.label = "d"',
              "L = d {{op}} f",
              'L.label = "L"',
              "",
              "from_graph = np.array([e.data, d.data, L.data])",
              "plain = np.array([2.0 * -3.0, 2.0 * -3.0 + 10.0, (2.0 * -3.0 + 10.0) {{op}} {{f}}])",
              "same = from_graph == plain",
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
            "A `Value` holds a number in `data` and a gradient in `grad`, starting at `0.0`.",
            "`a + b` calls `a.__add__(b)`; the result keeps its inputs in `_prev` and its operation in `_op`.",
            "Chained operations build a computation graph: values are nodes, inputs are children.",
            "Following `_prev` from the output reaches every input, the path gradients will take back.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "autograd-01-q1",
      question: "After `e = a * b`, what does `e._prev` hold?",
      options: [
        "The numbers `a.data` and `b.data`",
        "The two `Value` objects `a` and `b`",
        "The string `\"*\"`",
        "Nothing until `backward()` runs",
      ],
      answer: 1,
      explanation: "`_prev` keeps the input objects themselves, so the graph can be followed back to them; the symbol is in `_op`.",
    },
    {
      id: "autograd-01-q2",
      question: "What does Python run when you write `a + b` for two values?",
      options: ["`b.__add__(a)`", "`Value.__init__(a, b)`", "`a.__add__(b)`", "`a.data + b.data`, and nothing else"],
      answer: 2,
      explanation: "The operator calls the left operand's `__add__` method with the right operand; that method builds the new node.",
    },
    {
      id: "autograd-01-q3",
      question: "In a computation graph, which nodes have an empty `_prev`?",
      options: ["The output", "The inputs you created yourself", "Every node made by `*`"],
      answer: 1,
      explanation: "Values you create directly were not produced by an operation, so they have no children.",
    },
  ],
  practiceStarter: [
    VALUE_01,
    "",
    "# Build a graph and step through it: the graph view grows with every line.",
    'x = Value(3.0, label="x")',
    'w = Value(0.5, label="w")',
    'b = Value(1.0, label="b")',
    "xw = x * w",
    'xw.label = "xw"',
    "n = xw + b",
    'n.label = "n"',
    "print(n.data, n._op)",
  ].join("\n"),
};
