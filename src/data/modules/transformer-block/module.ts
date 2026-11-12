import type { ModuleDef } from "@/features/content/types";

import { TRANSFORMER_BLOCK_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 3.3 (R6 brief). Not listed as open until its content and tests are done. */
export const TRANSFORMER_BLOCK_MODULE: ModuleDef = {
  slug: "transformer-block",
  number: "3.3",
  title: "The Transformer Block",
  description: "Assemble attention, residual connections, layer normalization and a feed-forward layer into one block.",
  objectives: [
    "Split Q, K and V into heads with reshape and transpose, run attention per head and join the heads back",
    "Wrap a sublayer in a residual connection, x + sublayer(x), and explain why the shapes must match",
    "Normalize each row with layer normalization, using axis=-1 and keepdims=True, then apply gamma and beta",
    "Build sinusoidal positional encodings and explain why attention needs them",
    "Run a full transformer block: attention and a feed-forward layer, each with a residual connection and layer normalization",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Multi-Head Attention" },
    { id: "02", title: "Residual Connections" },
    { id: "03", title: "Layer Normalization" },
    { id: "04", title: "Positional Encoding and the Full Block" },
  ],
  content: LESSON_CONTENT,
  exercises: TRANSFORMER_BLOCK_EXERCISES,
};
