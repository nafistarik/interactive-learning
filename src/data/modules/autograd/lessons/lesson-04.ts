import type { LessonContent } from "@/features/content/types";

import { VALUE_ADD, VALUE_BACKWARD, VALUE_MUL, VALUE_TANH, valueClass } from "../value-class";

/** The finished engine: `+`, `*`, `tanh` and `backward()`. */
const VALUE_04 = ["import math", "", valueClass(VALUE_ADD, VALUE_MUL, VALUE_TANH, VALUE_BACKWARD)].join("\n");

/** The lesson's neuron inputs and parameters, as labelled values. */
const NEURON_INPUTS = [
  'x1 = Value(1.0, label="x1")',
  'x2 = Value(-2.0, label="x2")',
  'w1 = Value(0.5, label="w1")',
  'w2 = Value(0.25, label="w2")',
  'b = Value(0.5, label="b")',
].join("\n");

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Add `tanh` to `Value` and build the neuron `tanh(w1*x1 + w2*x2 + b)` from Module 2.1. One `backward()` gives the gradient of every weight, a numeric check confirms them, and one gradient-descent step lowers the loss.",
  estimatedMinutes: 20,
  sections: [
    {
      title: "What a neuron in autograd is",
      blocks: [
        {
          kind: "text",
          text: "A neuron computes a weighted sum of its inputs plus a bias, then an activation: `tanh(w1*x1 + w2*x2 + b)`. Built from `Value` objects, every multiplication, addition and the `tanh` become nodes of one graph.",
        },
        {
          kind: "note",
          text: "The parameters of the neuron are `w1`, `w2` and `b`, the numbers training changes. The inputs `x1` and `x2` are data; their gradients are computed too, but training does not change them.",
        },
      ],
    },
    {
      title: "Why autograd makes training general",
      blocks: [
        {
          kind: "text",
          text: "Gradient descent needs the slope of the loss for every parameter. In Module 2.2 you derived those formulas for one fixed network; with autograd, any calculation built from supported operations gets them from one `backward()` call.",
        },
        {
          kind: "text",
          text: "Libraries such as PyTorch work the same way: they record the operations of the forward pass and run local gradients backwards, on whole arrays instead of single numbers.",
        },
      ],
    },
    {
      title: "Adding tanh to Value",
      blocks: [
        {
          kind: "text",
          text: "`tanh` has one input, so the new node's `_prev` is the one-element tuple `(self,)` and its `_op` is `\"tanh\"`. `math.tanh` computes the tanh of one Python number.",
        },
        {
          kind: "text",
          text: "With `t = tanh(n)`, the local gradient is `1 - t * t`. The closure keeps `t` from the forward pass, so the backward pass does not compute tanh again.",
        },
        {
          kind: "code",
          code: [
            VALUE_04,
            "",
            'n = Value(0.5, label="n")',
            "o = n.tanh()",
            "o.backward()",
            "print(round(o.data, 4), round(n.grad, 4))",
          ].join("\n"),
          output: "0.4621 0.7864",
        },
      ],
    },
    {
      title: "One neuron, forward and backward",
      blocks: [
        {
          kind: "text",
          text: "Here `x1 = 1`, `x2 = -2`, `w1 = 0.5`, `w2 = 0.25` and `b = 0.5`, so the weighted sum `n` is `0.5`. After `o.backward()`, each value holds the slope of `o` with respect to it.",
        },
        {
          kind: "code",
          code: [
            VALUE_04,
            "",
            NEURON_INPUTS,
            "n = w1 * x1 + w2 * x2 + b",
            'n.label = "n"',
            "o = n.tanh()",
            'o.label = "o"',
            "o.backward()",
            "",
            "print(round(o.data, 4))",
            "print(round(w1.grad, 4), round(w2.grad, 4), round(b.grad, 4))",
            "print(round(x1.grad, 4), round(x2.grad, 4))",
          ].join("\n"),
          output: ["0.4621", "0.7864 -1.5729 0.7864", "0.3932 0.1966"].join("\n"),
        },
        {
          kind: "text",
          text: "`n.grad` is the local gradient of tanh, `0.7864`. Each weight's gradient is that times its input (`x2 = -2` gives `-1.5729`), and the bias gets it unchanged, as the `+` and `*` rules say.",
        },
      ],
    },
    {
      title: "Checking the gradients numerically",
      blocks: [
        {
          kind: "text",
          text: "As in Module 2.2, nudge one parameter by a small `h` up and down and measure how much the output moves. Plain floats are enough; no graph is needed.",
        },
        {
          kind: "code",
          code: [
            "import math",
            "x1, x2 = 1.0, -2.0",
            "",
            "def neuron(w1, w2, b):",
            "    return math.tanh(w1 * x1 + w2 * x2 + b)",
            "",
            "h = 0.0001",
            "dw1 = (neuron(0.5 + h, 0.25, 0.5) - neuron(0.5 - h, 0.25, 0.5)) / (2 * h)",
            "dw2 = (neuron(0.5, 0.25 + h, 0.5) - neuron(0.5, 0.25 - h, 0.5)) / (2 * h)",
            "db = (neuron(0.5, 0.25, 0.5 + h) - neuron(0.5, 0.25, 0.5 - h)) / (2 * h)",
            "print(round(dw1, 4), round(dw2, 4), round(db, 4))",
          ].join("\n"),
          output: "0.7864 -1.5729 0.7864",
        },
        {
          kind: "text",
          text: "The numbers agree with `backward()` to four decimals. A check like this is how you test a new operation's `_backward` rule.",
        },
      ],
    },
    {
      title: "One gradient-descent step",
      blocks: [
        {
          kind: "text",
          text: "To train, add a loss: here the squared error to a target of `1.0`, written as `err = o + Value(-1.0)` and `loss = err * err`. After `loss.backward()`, step every parameter against its gradient, then run the forward pass again.",
        },
        {
          kind: "code",
          code: [
            VALUE_04,
            "",
            NEURON_INPUTS,
            "o = (w1 * x1 + w2 * x2 + b).tanh()",
            "err = o + Value(-1.0)",
            "loss = err * err",
            "loss.backward()",
            "print(round(loss.data, 4))",
            "",
            "lr = 0.1",
            "for p in [w1, w2, b]:",
            "    p.data -= lr * p.grad",
            "print(round(w1.data, 4), round(w2.data, 4), round(b.data, 4))",
            "",
            "o = (w1 * x1 + w2 * x2 + b).tanh()",
            "err = o + Value(-1.0)",
            "print(round((err * err).data, 4))",
          ].join("\n"),
          output: ["0.2893", "0.5846 0.0808 0.5846", "0.0553"].join("\n"),
        },
        {
          kind: "text",
          text: "The loss fell from `0.2893` to `0.0553` in one step. The forward pass builds a new graph each time; a training loop would also reset every `grad` to `0.0` before the next `backward()`.",
        },
      ],
    },
    {
      title: "Try it: a step on the neuron",
      blocks: [
        {
          kind: "text",
          text: "Change `x1` and the learning rate. In Practice, the graph shows every node's `grad`; here `new_params` is the step `params - lr * grads`. With `x1 = 0`, the gradient of `w1` is `0`, so `w1` does not move.",
        },
        {
          kind: "playground",
          demo: {
            title: "Gradient step on a neuron",
            controls: [
              { type: "number", name: "x1", label: "x1", min: -2, max: 2, initial: 1 },
              {
                type: "select",
                name: "lr",
                label: "Learning rate",
                options: [
                  { label: "0.1", value: "0.1" },
                  { label: "0.5", value: "0.5" },
                  { label: "1.0", value: "1.0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              VALUE_04,
              "",
              'x1 = Value(float({{x1}}), label="x1")',
              'x2 = Value(-2.0, label="x2")',
              'w1 = Value(0.5, label="w1")',
              'w2 = Value(0.25, label="w2")',
              'b = Value(0.5, label="b")',
              "n = w1 * x1 + w2 * x2 + b",
              'n.label = "n"',
              "o = n.tanh()",
              'o.label = "o"',
              'err = o + Value(-1.0, label="-target")',
              'err.label = "err"',
              "loss = err * err",
              'loss.label = "loss"',
              "loss.backward()",
              "",
              "params = np.array([w1.data, w2.data, b.data])",
              "grads = np.array([w1.grad, w2.grad, b.grad])",
              "new_params = params - {{lr}} * grads",
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
            "`tanh` makes a node with one input, `_op = \"tanh\"` and local gradient `1 - t * t`.",
            "A neuron built from values is one graph; `backward()` gives the gradient of every weight and the bias.",
            "A numeric check with a small `h` confirms the gradients from `backward()`.",
            "Training steps each parameter with `p.data -= lr * p.grad`, after a backward pass on the loss.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "autograd-04-q1",
      question: "If `o = n.tanh()` and `o.data` is `0.6`, what does `o._backward()` add to `n.grad` when `o.grad` is `1.0`?",
      options: ["`0.6`", "`0.36`", "`0.64`", "`1.6`"],
      answer: 2,
      explanation: "The local gradient is `1 - t * t = 1 - 0.36 = 0.64`, times the upstream `1.0`.",
    },
    {
      id: "autograd-04-q2",
      question: "In `n = w1 * x1 + w2 * x2 + b`, what is `w1.grad` after `n.grad` is known?",
      options: ["`n.grad`", "`x1.data * n.grad`", "`w1.data * n.grad`", "`x1.data + n.grad`"],
      answer: 1,
      explanation: "`+` passes `n.grad` to `w1 * x1`, and `*` multiplies it by the other input, `x1.data`.",
    },
    {
      id: "autograd-04-q3",
      question: "Which line performs one gradient-descent step on a parameter `p`?",
      options: ["`p.grad -= lr * p.data`", "`p.data += lr * p.grad`", "`p.data -= lr * p.grad`"],
      answer: 2,
      explanation: "The parameter's value moves against its gradient, scaled by the learning rate.",
    },
  ],
};
