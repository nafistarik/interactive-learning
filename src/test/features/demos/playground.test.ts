import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import { MODULES } from "@/data/curriculum";
import type { PlaygroundDemo } from "@/features/content/types";
import { clampNumber, fillTemplate, initialValues, testValueSets } from "@/features/demos/playground";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";

import { loadTestPyodide, preparePackages } from "../../lib/python/load-test-pyodide";

const SAMPLE: PlaygroundDemo = {
  title: "Sample",
  controls: [
    { type: "select", name: "axis", label: "Axis", options: [{ label: "0", value: "0" }, { label: "1", value: "1" }] },
    { type: "number", name: "n", label: "n", min: 1, max: 4, initial: 2 },
  ],
  template: "import numpy as np\na = np.ones(({{n}}, 3))\nr = a.sum(axis={{axis}})",
};

describe("playground templates", () => {
  it("fills each placeholder from its control", () => {
    expect(fillTemplate(SAMPLE, initialValues(SAMPLE))).toContain("np.ones((2, 3))");
    expect(fillTemplate(SAMPLE, { axis: 1, n: 3 })).toContain("axis=1");
  });

  it("clamps numbers and rejects non-numbers", () => {
    const control = SAMPLE.controls[1] as Extract<PlaygroundDemo["controls"][number], { type: "number" }>;
    expect(clampNumber(control, 99)).toBe(4);
    expect(clampNumber(control, 2.6)).toBe(3);
    expect(clampNumber(control, Number.NaN)).toBe(2);
  });

  it("refuses a placeholder without a control", () => {
    expect(() => fillTemplate({ ...SAMPLE, template: "{{missing}}" }, {})).toThrow();
  });

  it("tests every option of every control", () => {
    expect(testValueSets(SAMPLE)).toHaveLength(5);
  });
});

/** Every playground in the lesson data, with where it is. */
const PLAYGROUNDS = MODULES.flatMap((mod) =>
  mod.content.flatMap((lesson) =>
    lesson.sections.flatMap((section) =>
      section.blocks.flatMap((block) =>
        block.kind === "playground" ? [{ label: `${mod.slug}/${lesson.lessonId} · ${block.demo.title}`, demo: block.demo }] : [],
      ),
    ),
  ),
);

/* Every playground, with every option, records in Pyodide; a failure must come from a recorded operation. */
describe("lesson playgrounds run in Pyodide", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
    installRecorder(pyodide);
  }, 180_000);

  it("every playground records with every option", async () => {
    for (const { label, demo } of PLAYGROUNDS) {
      for (const values of testValueSets(demo)) {
        const code = fillTemplate(demo, values);
        await preparePackages(pyodide, code);
        const outcome = recordFrames(pyodide, code);
        expect(outcome.ok, `${label}\n${code}`).toBe(true);
        const last = outcome.ok ? outcome.frames.at(-1) : undefined;
        if (last?.status === "error") {
          // An intended failure (a shape mismatch to explore) is a recorded operation that failed.
          expect(last.operations.length, `${label}\n${code}\n→ ${last.error?.message}`).toBeGreaterThan(0);
          expect(last.operations.at(-1)?.result, `${label}\n${code}`).toBeUndefined();
        }
        if (!demo.show?.length) {
          // Something to draw: a recorded operation or a recorded loop (training demos).
          expect(
            outcome.ok && outcome.frames.some((frame) => frame.operations.length > 0 || frame.loop !== undefined),
            `${label}\n${code}`,
          ).toBe(true);
        }
      }
    }
  });
});
