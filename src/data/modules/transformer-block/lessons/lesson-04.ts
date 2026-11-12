import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Attention cannot see the order of tokens, so a positional encoding of sine and cosine waves is added to the embeddings. Then attention and a feed-forward layer, each with a residual connection and layer normalization, form one transformer block.",
  estimatedMinutes: 20,
  sections: [
    {
      title: "What a positional encoding is",
      blocks: [
        {
          kind: "text",
          text: "A positional encoding is a matrix `pe` of shape `(n, d_model)` whose row `pos` describes position `pos`. It is added to the embeddings, `x = embeddings + pe`, so each token's row also carries where it stands.",
        },
        {
          kind: "text",
          text: "The sinusoidal encoding fills each pair of columns with a sine and a cosine. For even column `i`, the angle is `pos / 10000 ** (i / d)`; column `i` holds its sine and column `i + 1` its cosine.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "n, d = 4, 4",
            "pos = np.arange(n).reshape(n, 1)",
            "i = np.arange(0, d, 2)",
            "angles = pos / 10000 ** (i / d)",
            "pe = np.zeros((n, d))",
            "pe[:, 0::2] = np.sin(angles)",
            "pe[:, 1::2] = np.cos(angles)",
            "print(angles.shape)",
            "print(np.round(pe, 3).tolist())",
          ].join("\n"),
          output: [
            "(4, 2)",
            "[[0.0, 1.0, 0.0, 1.0], [0.841, 0.54, 0.01, 1.0], [0.909, -0.416, 0.02, 1.0], [0.141, -0.99, 0.03, 1.0]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "`pos` has shape `(n, 1)` and `i` has shape `(d / 2,)`, so broadcasting gives one angle per position and column pair. `0::2` selects the even columns and `1::2` the odd ones.",
        },
      ],
    },
    {
      title: "Why attention needs to be told the order",
      blocks: [
        {
          kind: "text",
          text: "Attention compares every token with every other token, but nothing in `Q @ K.T` or `weights @ V` depends on where a row sits. Shuffle the tokens and the outputs are only shuffled the same way, so \"dog bites man\" and \"man bites dog\" would look alike.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "def self_attention(x):",
            "    scores = x @ x.T / np.sqrt(x.shape[1])",
            "    e = np.exp(scores - scores.max(axis=-1, keepdims=True))",
            "    weights = e / e.sum(axis=-1, keepdims=True)",
            "    return weights @ x",
            "x = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])",
            "order = [2, 0, 1]",
            "print(np.allclose(self_attention(x)[order], self_attention(x[order])))",
            "p = np.arange(3).reshape(3, 1)",
            "pe = np.concatenate([np.sin(p), np.cos(p)], axis=1)",
            "print(np.allclose(self_attention(x + pe)[order], self_attention(x[order] + pe)))",
          ].join("\n"),
          output: ["True", "False"].join("\n"),
        },
        {
          kind: "text",
          text: "Without `pe`, attention on the shuffled tokens gives exactly the shuffled outputs. With `pe` added, the positions stay in place while the tokens move, so the outputs change.",
        },
      ],
    },
    {
      title: "How the waves mark each position",
      blocks: [
        {
          kind: "list",
          items: [
            "The first column pair turns fastest: its angle grows by 1 per position. Each later pair turns more slowly, by a factor of `10000 ** (2 / d)`.",
            "Together the pairs give every position its own row, like the hands of a clock moving at different speeds.",
            "All values lie between -1 and 1, so adding `pe` does not swamp the embeddings.",
            "The encoding is a fixed formula, not learned, and it works for any `n`.",
          ],
        },
        {
          kind: "note",
          text: "Position 0 is always `[0, 1, 0, 1, ...]`: the sine of 0 is 0 and the cosine of 0 is 1.",
        },
      ],
    },
    {
      title: "A practical example: the full transformer block",
      blocks: [
        {
          kind: "text",
          text: "The feed-forward layer is the two-layer network of Module 2.1 applied to each row separately: `ffn(h) = relu(h @ W1 + b1) @ W2 + b2`. `W1` widens each row, often to 4 times `d_model`, and `W2` brings it back to `d_model`, so the residual sum fits.",
        },
        {
          kind: "text",
          text: "A transformer block chains the two sublayers, each with a residual connection and layer normalization: `h = layer_norm(x + attention(x))`, then `out = layer_norm(h + ffn(h))`. The output has the shape of the input, so blocks can be stacked.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "def self_attention(x):",
            "    scores = x @ x.T / np.sqrt(x.shape[1])",
            "    e = np.exp(scores - scores.max(axis=-1, keepdims=True))",
            "    weights = e / e.sum(axis=-1, keepdims=True)",
            "    return weights @ x",
            "def layer_norm(x, eps=1e-5):",
            "    mean = x.mean(axis=-1, keepdims=True)",
            "    return (x - mean) / np.sqrt(x.var(axis=-1, keepdims=True) + eps)",
            "def ffn(h, W1, b1, W2, b2):",
            "    return np.maximum(0, h @ W1 + b1) @ W2 + b2",
            "x = np.array([[1.0, 0.0, 1.0, 0.0], [0.0, 2.0, 0.0, 1.0], [1.0, 1.0, -1.0, 0.0]])",
            "W1 = np.linspace(-1, 1, 32).reshape(4, 8)",
            "b1 = np.zeros(8)",
            "W2 = np.linspace(1, -1, 32).reshape(8, 4)",
            "b2 = np.zeros(4)",
            "h = layer_norm(x + self_attention(x))",
            "out = layer_norm(h + ffn(h, W1, b1, W2, b2))",
            "print(h.shape, out.shape)",
            "print(np.round(out, 3).tolist())",
            "print(np.round(out.std(axis=-1), 3).tolist())",
          ].join("\n"),
          output: [
            "(3, 4) (3, 4)",
            "[[1.284, -0.593, 0.593, -1.284], [-0.67, 1.567, -1.037, 0.14], [0.693, 1.079, -1.512, -0.26]]",
            "[1.0, 1.0, 1.0]",
          ].join("\n"),
        },
        {
          kind: "note",
          text: "This `layer_norm` leaves out `gamma` and `beta`, as if `gamma` were all ones and `beta` all zeros. A real block also uses multi-head attention with learned `Q`, `K` and `V` weights.",
        },
      ],
    },
    {
      title: "Try it: the positional encoding as a heatmap",
      blocks: [
        {
          kind: "text",
          text: "Change the number of positions and the width `d`, and watch the sines and cosines fill `pe`. The first columns change quickly from row to row; the last columns barely change.",
        },
        {
          kind: "playground",
          demo: {
            title: "Sinusoidal positional encoding",
            controls: [
              { type: "number", name: "n", label: "Positions n", min: 1, max: 8, initial: 6 },
              {
                type: "select",
                name: "d",
                label: "Width d",
                options: [
                  { label: "4", value: "4" },
                  { label: "6", value: "6" },
                  { label: "8", value: "8" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "pos = np.arange({{n}}).reshape({{n}}, 1)",
              "i = np.arange(0, {{d}}, 2)",
              "angles = pos / 10000 ** (i / {{d}})",
              "pe = np.zeros(({{n}}, {{d}}))",
              "pe[:, 0::2] = np.sin(angles)",
              "pe[:, 1::2] = np.cos(angles)",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "pe",
              rowLabels: ["pos 0", "pos 1", "pos 2", "pos 3", "pos 4", "pos 5", "pos 6", "pos 7"],
            },
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
            "Attention ignores order: shuffling the tokens only shuffles its outputs.",
            "A positional encoding `pe` of shape `(n, d_model)` is added to the embeddings to mark each position.",
            "Sinusoidal encoding: angle `pos / 10000 ** (i / d)`, its sine in column `i` and its cosine in column `i + 1`.",
            "The feed-forward layer is `relu(h @ W1 + b1) @ W2 + b2`, applied to each row.",
            "A block: `h = layer_norm(x + attention(x))`, then `out = layer_norm(h + ffn(h))`, with the shape of `x`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "transformer-block-04-q1",
      question: "Why does a transformer add a positional encoding to the embeddings?",
      options: [
        "Attention alone does not depend on the order of the tokens",
        "It makes the embeddings smaller",
        "It replaces the softmax",
      ],
      answer: 0,
      explanation: "Shuffling the tokens only shuffles attention's outputs; `pe` gives each position its own values.",
    },
    {
      id: "transformer-block-04-q2",
      question: "In the sinusoidal encoding, what is row 0 of `pe` with `d = 4`?",
      options: ["`[0, 0, 0, 0]`", "`[1, 1, 1, 1]`", "`[0, 1, 0, 1]`", "`[1, 0, 1, 0]`"],
      answer: 2,
      explanation: "At position 0 every angle is 0: sine 0 in the even columns, cosine 1 in the odd ones.",
    },
    {
      id: "transformer-block-04-q3",
      question: "`h` has shape `(3, 4)`, `W1` has shape `(4, 16)`. What shape must `W2` have so that `h + ffn(h)` works?",
      options: ["`(4, 16)`", "`(16, 4)`", "`(16, 16)`", "`(3, 4)`"],
      answer: 1,
      explanation: "`ffn(h)` must come back to 4 columns to match `h`: `(3, 16) @ (16, 4)` gives `(3, 4)`.",
    },
    {
      id: "transformer-block-04-q4",
      question: "Which line is the second half of a transformer block?",
      options: [
        "`out = layer_norm(h + ffn(h))`",
        "`out = ffn(layer_norm(h)) * h`",
        "`out = layer_norm(ffn(h))`",
      ],
      answer: 0,
      explanation: "The feed-forward layer gets a residual connection, then layer normalization.",
    },
  ],
};
