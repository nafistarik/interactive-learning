# R6 — Phase 3 Transformers and Phase 4 Reinforcement Learning, in NumPy

Started 2026-11-13. Builds on R5 ([`docs/r5/`](../r5/README.md)); every earlier rule still
applies. No backend, no PyTorch, no LLM: toy-sized models that run in NumPy in the browser.
Phase 5 (Agentic AI) needs a real LLM and waits for the AI decision
([open decisions](../roadmap/04-open-decisions.md), #7).

## Phase 3 "Transformers in NumPy"

| Module | Slug | Lessons | Exercises |
|---|---|---|---|
| 3.1 Tokens and Embeddings | `embeddings` | 4 | ex38–ex40 |
| 3.2 Attention | `attention` | 4 | ex41–ex43 (one bug hunt) |
| 3.3 The Transformer Block | `transformer-block` | 4 | ex44–ex46 (one bug hunt) |
| 3.4 A Tiny Language Model | `language-model` | 4 | ex47–ex49 |

3.1 — text to tokens and ids, a vocabulary, one-hot vectors, an embedding table and lookup
(`E[ids]` equals `one_hot @ E`), cosine similarity between embeddings.
3.2 — queries, keys and values; scores `Q @ K.T`; scaling by `sqrt(d)`; softmax along rows
(stable: subtract the row max); the output `weights @ V`; reading the attention weights.
3.3 — multi-head attention by reshaping, residual connections, layer normalization
(`(x - mean) / std` with `keepdims`), the feed-forward layer, sinusoidal positional encoding.
3.4 — next-token prediction; bigram counts to probabilities; greedy generation from a tiny
vocabulary; the causal mask (`np.triu`, `-inf` before softmax) so a token cannot look ahead.

## Phase 4 "Reinforcement Learning in NumPy"

| Module | Slug | Lessons | Exercises |
|---|---|---|---|
| 4.1 Agents and Environments | `rl-basics` | 4 | ex50–ex52 |
| 4.2 Values and the Bellman Equation | `value-iteration` | 4 | ex53–ex55 (one bug hunt) |
| 4.3 Q-Learning | `q-learning` | 4 | ex56–ex58 (one bug hunt) |
| 4.4 Policies in Practice | `policies` | 4 | ex59–ex61 |

4.1 — a small grid world (states as cells, actions, rewards, terminal states), an episode
loop, returns and discounting.
4.2 — state values, the Bellman update, value iteration until it stops changing, extracting
the greedy policy.
4.3 — the Q-table, epsilon-greedy with a seeded `np.random.default_rng`, the Q-learning
update, learning curves (return per episode).
4.4 — exploration vs exploitation, learning rate and discount effects, comparing a learned
policy with random play, when tabular methods stop scaling.

## Engine and views

- **`np.sin`, `np.cos`** are recorded as ufunc steps (positional encoding).
- **Heatmap chart:** lesson data or an exercise can declare
  `chart: { kind: "heatmap", matrix: "<name>", rowLabels?: [...], colLabels?: [...] }`. It
  draws a 2D array (≤ 8 × 8, from a ≤ 64-value snapshot) as cells shaded by value in one
  hue, each with its number. In a loop frame it shows the matrix at the selected iteration
  (value iteration's `V` filling in; a Q-table learning); otherwise the final value
  (attention weights). Labels are authored strings (tokens, states).

## Done when

- Phases 3 and 4 each show four open modules with the usual content, demo, check and test
  coverage (curriculum, content, validator, playground, e2e incl. the phone check).
- Attention weights and value tables are drawn as heatmaps from recorded data.
