import type { LessonContent } from "@/features/content/types";

import { VALUE_ADD, VALUE_MUL, valueClass } from "../value-class";

/** The class of this lesson: `+` and `*`, each with its `_backward` rule. */
const VALUE_02 = valueClass(VALUE_ADD, VALUE_MUL);

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Every operation knows one small rule: how to pass its output's gradient back to its own inputs. `+` passes it through unchanged, `*` multiplies it by the other input, and gradients add up with `+=`.",
  estimatedMinutes: 18,
  sections: [
    {
      title: "What a local gradient is",
      blocks: [
        {
          kind: "text",
          text: "A local gradient is the slope of one operation's output with respect to one of its inputs, looking at that operation alone. For `out = a + b` it is `1` for both inputs; for `out = a * b` it is `b` for `a` and `a` for `b`.",
        },
        {
          kind: "note",
          text: "The upstream gradient is `out.grad`, the slope of the final output with respect to `out`. The chain rule from Module 2.2 gives each input's share: local gradient times upstream gradient.",
        },
      ],
    },
    {
      title: "Why each operation carries its own rule",
      blocks: [
        {
          kind: "text",
          text: "An operation only sees its inputs and its output, so its local gradient is simple to write down once. The chain rule then multiplies these small slopes along the path from the output to each input.",
        },
        {
          kind: "text",
          text: "So the engine never needs the formula of the whole calculation. To support a new operation, you write its forward result and its local gradient, and every graph that uses it can be differentiated.",
        },
      ],
    },
    {
      title: "Writing _backward as a closure",
      blocks: [
        {
          kind: "text",
          text: "Each operation attaches a function `_backward` to the value it returns. The function is defined inside `__mul__`, so it remembers `self`, `other` and `out` and can use them later, when it is called; a function that remembers its surroundings like this is called a closure.",
        },
        {
          kind: "text",
          text: "An input value has nothing to pass on, so `__init__` sets `self._backward = lambda: None`, a function that does nothing. Below, `out.grad` is set to `1.0` by hand and one call to `_backward` fills both inputs.",
        },
        {
          kind: "code",
          code: [
            VALUE_02,
            "",
            'a = Value(2.0, label="a")',
            'b = Value(-3.0, label="b")',
            "out = a * b",
            "out.grad = 1.0",
            "out._backward()",
            "print(a.grad, b.grad)",
            "",
            "s = a + b",
            "s.grad = 5.0",
            "s._backward()",
            "print(a.grad, b.grad)",
          ].join("\n"),
          output: ["-3.0 2.0", "2.0 7.0"].join("\n"),
        },
        {
          kind: "text",
          text: "For `*`, `a.grad` becomes `b.data` times the upstream `1.0`, and `b.grad` becomes `a.data`. The sum `s` then passes its upstream `5.0` through unchanged, and it is added to what each input already had: `-3.0 + 5.0` and `2.0 + 5.0`.",
        },
      ],
    },
    {
      title: "Running a graph backwards by hand",
      blocks: [
        {
          kind: "text",
          text: "For `L = (a * b + c) * f`, set `L.grad = 1.0` (the slope of `L` with respect to itself) and call `_backward` on each operation's result, from the output towards the inputs.",
        },
        {
          kind: "code",
          code: [
            VALUE_02,
            "",
            'a = Value(2.0, label="a")',
            'b = Value(-3.0, label="b")',
            'c = Value(10.0, label="c")',
            'f = Value(-2.0, label="f")',
            "e = a * b",
            "d = e + c",
            "L = d * f",
            "",
            "L.grad = 1.0",
            "L._backward()",
            "d._backward()",
            "e._backward()",
            "print(a.grad, b.grad, c.grad, f.grad)",
          ].join("\n"),
          output: "6.0 -4.0 -2.0 4.0",
        },
        {
          kind: "text",
          text: "`L._backward()` gives `d.grad = f.data = -2.0`; `d` passes it to `e` and `c`; `e` multiplies it by the other input. The chain rule by hand gives the same: the slope for `a` is `b * f = 6`.",
        },
      ],
    },
    {
      title: "Why gradients add up with +=",
      blocks: [
        {
          kind: "text",
          text: "A value can be used more than once. In `y = a * a`, `a` is both `self` and `other`, so `_backward` runs both of its lines on the same object, and each line adds one share.",
        },
        {
          kind: "code",
          code: [
            VALUE_02,
            "",
            'a = Value(3.0, label="a")',
            "y = a * a",
            "y.grad = 1.0",
            "y._backward()",
            "print(a.grad)",
          ].join("\n"),
          output: "6.0",
        },
        {
          kind: "note",
          text: "The slope of `a * a` is `2 * a`, which is `6.0` here. With `=` instead of `+=`, the second line would overwrite the first and leave `3.0`, half the right answer.",
        },
      ],
    },
    {
      title: "Try it: local gradients times upstream",
      blocks: [
        {
          kind: "text",
          text: "Choose an operation, the value of `a` and the upstream gradient. The gradients scale with the upstream value; dividing by it gives back the local gradients in `local`.",
        },
        {
          kind: "playground",
          demo: {
            title: "One backward step",
            controls: [
              {
                type: "select",
                name: "expr",
                label: "Operation",
                options: [
                  { label: "out = a * b", value: "a * b" },
                  { label: "out = a + b", value: "a + b" },
                  { label: "out = a * a", value: "a * a" },
                ],
              },
              { type: "number", name: "a", label: "a", min: -3, max: 3, initial: 2 },
              { type: "number", name: "up", label: "Upstream out.grad", min: 1, max: 5, initial: 1 },
            ],
            template: [
              "import numpy as np",
              "",
              VALUE_02,
              "",
              'a = Value(float({{a}}), label="a")',
              'b = Value(-3.0, label="b")',
              "out = {{expr}}",
              'out.label = "out"',
              "out.grad = float({{up}})",
              "out._backward()",
              "",
              "grads = np.array([a.grad, b.grad])",
              "local = grads / out.grad",
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
            "A local gradient is the slope of one operation's output with respect to one input.",
            "`_backward` adds local gradient times `out.grad` to each input's `grad`.",
            "`+` passes `out.grad` through; `*` multiplies it by the other input's `data`.",
            "Gradients accumulate with `+=`, so a value used twice receives both shares.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "autograd-02-q1",
      question: "For `out = a * b` with `out.grad = 2.0`, `a.data = 4.0` and `b.data = 5.0`, what does `out._backward()` add to `a.grad`?",
      options: ["`2.0`", "`8.0`", "`10.0`", "`20.0`"],
      answer: 2,
      explanation: "The local gradient for `a` is `b.data = 5.0`, times the upstream `2.0`.",
    },
    {
      id: "autograd-02-q2",
      question: "What does `+` pass back to each of its inputs?",
      options: [
        "The upstream gradient `out.grad`, unchanged",
        "The other input's `data`",
        "Half of `out.grad` each",
      ],
      answer: 0,
      explanation: "The local gradient of a sum is `1` for each input, so each receives `out.grad` as it is.",
    },
    {
      id: "autograd-02-q3",
      question: "Why does `_backward` use `+=` instead of `=`?",
      options: [
        "`=` does not work on attributes",
        "A value used more than once must collect a share from every use",
        "To make the gradient grow at every training step",
      ],
      answer: 1,
      explanation: "Each use adds its own share; `=` would keep only the last one, as `a * a` shows.",
    },
  ],
};
