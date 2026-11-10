import type { PlaygroundControl, PlaygroundDemo } from "@/features/content/types";

/** The current value of each control, by name. Select values are option indexes. */
export type PlaygroundValues = Record<string, number>;

/**
 * Starting values: the first option of each select, the initial number of each number input.
 *
 * @param demo - The demo.
 * @returns The values.
 */
export function initialValues(demo: PlaygroundDemo): PlaygroundValues {
  return Object.fromEntries(
    demo.controls.map((control) => [control.name, control.type === "select" ? 0 : control.initial]),
  );
}

/**
 * Keeps a number inside its control's range; anything that is not a finite number becomes
 * the initial value. Only integers are allowed, so the code never gets unexpected text.
 *
 * @param control - A number control.
 * @param value - The raw value.
 * @returns A safe integer.
 */
export function clampNumber(control: Extract<PlaygroundControl, { type: "number" }>, value: number): number {
  if (!Number.isFinite(value)) {
    return control.initial;
  }
  return Math.min(control.max, Math.max(control.min, Math.round(value)));
}

/**
 * Fills the template. Select controls insert their authored option value; number controls
 * insert a clamped integer. Nothing the learner types reaches Python as text.
 *
 * @param demo - The demo.
 * @param values - Current values.
 * @returns The Python code to record.
 * @throws When the template uses a placeholder no control defines.
 */
export function fillTemplate(demo: PlaygroundDemo, values: PlaygroundValues): string {
  return demo.template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const control = demo.controls.find((item) => item.name === name);
    if (!control) {
      throw new Error(`Playground "${demo.title}" has no control named ${name}`);
    }
    if (control.type === "select") {
      const option = control.options[values[name] ?? 0] ?? control.options[0];
      return option.value;
    }
    return String(clampNumber(control, values[name] ?? control.initial));
  });
}

/**
 * Every value set the content test runs: the initial values, then each control moved through
 * its options (selects) or to its min and max (numbers), one control at a time.
 *
 * @param demo - The demo.
 * @returns Value sets to test.
 */
export function testValueSets(demo: PlaygroundDemo): PlaygroundValues[] {
  const base = initialValues(demo);
  const sets: PlaygroundValues[] = [base];
  for (const control of demo.controls) {
    const choices =
      control.type === "select" ? control.options.map((_, index) => index) : [control.min, control.max];
    for (const choice of choices) {
      sets.push({ ...base, [control.name]: choice });
    }
  }
  return sets;
}
