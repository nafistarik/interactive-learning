import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "In reinforcement learning an agent acts, and its environment answers with a reward and the next state. This lesson names the parts of that loop and runs it in a five-cell corridor.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What reinforcement learning is",
      blocks: [
        {
          kind: "text",
          text: "In Phases 1 and 2 every training example came with the right answer, and the model learned to copy it. Reinforcement learning has no right answers to copy: it learns from rewards it collects by acting.",
        },
        {
          kind: "note",
          text: "The agent is the learner that chooses what to do. The environment is everything else: it takes the agent's choice, changes, and answers with a number that says how good the result was.",
        },
      ],
    },
    {
      title: "Why learn from rewards",
      blocks: [
        {
          kind: "text",
          text: "For many tasks nobody can write down the right move for every situation: a game, a robot finding its way, a route through a maze. It is much easier to say what counts as success, such as reaching a goal.",
        },
        {
          kind: "text",
          text: "A reward often comes late: a game is only won at the end. The agent has to work out which of its earlier choices led there, which is what Phase 4 builds up to.",
        },
      ],
    },
    {
      title: "States, actions, rewards and episodes",
      blocks: [
        {
          kind: "list",
          items: [
            "A state describes the situation the agent is in, here a number for the cell it stands in.",
            "An action is one choice the agent can make in a state, such as moving right.",
            "A reward is the number the environment returns after each action: positive is good, negative is bad, 0 is neutral.",
            "A terminal state ends the interaction, for example reaching the goal or falling into a pit.",
            "An episode is one run from a start state until a terminal state, or until a step limit.",
            "A policy is the agent's rule for picking an action in each state.",
          ],
        },
        {
          kind: "text",
          text: "Each step of the loop has the same shape: the agent sees `state` and picks `action`; the environment returns `next_state`, `reward` and `done`, a flag that is `True` when `next_state` is terminal. Then `next_state` becomes the new `state`.",
        },
      ],
    },
    {
      title: "A corridor of five cells",
      blocks: [
        {
          kind: "text",
          text: "The smallest useful environment is a corridor of cells 0 to 4. The agent moves left (`-1`) or right (`1`), `np.clip` keeps it inside the corridor, and arriving in cell 4 gives a reward of 1 and ends the episode.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rewards_at = np.array([0, 0, 0, 0, 1])  # reward for arriving in each cell",
            "state = 2",
            "action = 1  # 1 moves right, -1 moves left",
            "",
            "next_state = int(np.clip(state + action, 0, 4))",
            "reward = int(rewards_at[next_state])",
            "done = next_state == 4",
            "print(next_state, reward, done)",
          ].join("\n"),
          output: "3 0 False",
        },
        {
          kind: "text",
          text: "One step is not enough to reach the goal, so the agent repeats the loop. The policy below is \"always move right\", and the loop stops when `done` is reached or after 10 steps.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rewards_at = np.array([0, 0, 0, 0, 1])",
            "state = 0",
            "total = 0",
            "",
            "for t in range(10):",
            "    action = 1  # the policy: always move right",
            "    state = int(np.clip(state + action, 0, 4))",
            "    reward = int(rewards_at[state])",
            "    total += reward",
            '    print("step", t, "state", state, "reward", reward)',
            "    if state == 4:",
            "        break",
            'print("total reward:", total)',
          ].join("\n"),
          output: [
            "step 0 state 1 reward 0",
            "step 1 state 2 reward 0",
            "step 2 state 3 reward 0",
            "step 3 state 4 reward 1",
            "total reward: 1",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The policy \"always move left\" would push against the wall at cell 0 for all 10 steps and collect nothing. The step limit is what ends that episode.",
        },
      ],
    },
    {
      title: "Try it: policies in the corridor",
      blocks: [
        {
          kind: "text",
          text: "Pick a policy and a step limit, then step through the loop and watch `state`, `reward` and `total` change. Compare how many steps each policy needs, and which ones never reach the goal.",
        },
        {
          kind: "playground",
          demo: {
            title: "An agent in a corridor",
            controls: [
              {
                type: "select",
                name: "policy",
                label: "Policy",
                options: [
                  { label: "Always right", value: "1" },
                  { label: "Always left", value: "-1" },
                  { label: "Left every third step", value: "-1 if t % 3 == 2 else 1" },
                  { label: "Random (seed 0)", value: "int(rng.choice([-1, 1]))" },
                ],
              },
              { type: "number", name: "steps", label: "Step limit", min: 1, max: 12, initial: 8 },
            ],
            template: [
              "import numpy as np",
              "rng = np.random.default_rng(0)",
              "rewards_at = np.array([0, 0, 0, 0, 1])",
              "state = 0",
              "total = 0",
              "for t in range({{steps}}):",
              "    action = {{policy}}",
              "    state = int(np.clip(state + action, 0, 4))",
              "    reward = int(rewards_at[state])",
              "    total = total + reward",
              "    if state == 4:",
              "        break",
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
            "The agent picks actions; the environment answers each one with a reward and the next state.",
            "A state is the agent's situation, an action is a choice, a reward is a number for how good the result was.",
            "A terminal state ends an episode; a step limit ends episodes that would never finish.",
            "A policy is the rule that picks an action in each state; the agent's goal is a policy that collects as much reward as possible.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "rl-basics-01-q1",
      question: "In reinforcement learning, what does the environment return after the agent's action?",
      options: [
        "The right action for that state",
        "A reward and the next state (and whether it is terminal)",
        "The agent's policy",
        "A label for the training example",
      ],
      answer: 1,
      explanation: "There is no right answer to copy: the environment only says what happened next and how good it was.",
    },
    {
      id: "rl-basics-01-q2",
      question: "What is an episode?",
      options: [
        "One action and its reward",
        "The rule that picks actions",
        "One run from a start state until a terminal state or a step limit",
        "The list of all states",
      ],
      answer: 2,
      explanation: "An episode is the whole run; a single action and its reward is one step of it.",
    },
    {
      id: "rl-basics-01-q3",
      question: "In the corridor, the policy is \"always move left\" and the agent starts in cell 0. What ends the episode?",
      options: ["Reaching cell 4", "The step limit", "A negative reward", "It ends after one step"],
      answer: 1,
      explanation: "The wall keeps the agent in cell 0, which is not terminal, so only the step limit stops the loop.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "rewards_at = np.array([0, 0, 0, 0, 1])",
    "state = 0",
    "total = 0",
    "",
    "# Try another policy: change the action rule, then run the episode.",
    "for t in range(10):",
    "    action = 1",
    "    state = int(np.clip(state + action, 0, 4))",
    "    reward = int(rewards_at[state])",
    "    total += reward",
    "    print(t, state, reward)",
    "    if state == 4:",
    "        break",
    "",
    'print("total reward:", total)',
  ].join("\n"),
};
