import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import { findExercise, MODULES } from "@/data/curriculum";
import type { Exercise } from "@/features/validation/types";
import { installRecorder } from "@/lib/python/record-frames";
import { validateExercise } from "@/lib/python/validate-exercise";

import { loadTestPyodide } from "./load-test-pyodide";

/** Every exercise of every module, including modules still in development. */
const EXERCISES = MODULES.flatMap((mod) => mod.exercises);
const findExerciseForLesson = (lessonId: string) => findExercise(MODULES[0], lessonId);

/** Validates code against an exercise with the exercise's own runs and checks. */
function check(pyodide: PyodideInterface, exercise: Exercise, code: string) {
  return validateExercise(pyodide, code, exercise.runs, exercise.checks);
}

/** The exercise with the given id, failing the test when it is missing. */
function exerciseById(id: string): Exercise {
  const exercise = EXERCISES.find((item) => item.id === id);
  if (!exercise) {
    throw new Error(`no exercise ${id}`);
  }
  return exercise;
}

describe("validateExercise with Pyodide and NumPy", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
    installRecorder(pyodide);
  }, 180_000);

  it("passes every exercise's own solution (content test)", () => {
    for (const exercise of EXERCISES) {
      expect(check(pyodide, exercise, exercise.solution), exercise.id).toEqual({
        passed: true,
        problems: [],
      });
    }
  });

  it("fails every bug hunt's starter code, so there is a bug to find (content test)", () => {
    for (const exercise of EXERCISES.filter((item) => item.type === "bug-hunt")) {
      expect(check(pyodide, exercise, exercise.starterCode).passed, exercise.id).toBe(false);
    }
  });

  it("fails every exercise's starter code (nothing passes before the learner works)", () => {
    for (const exercise of EXERCISES.filter((item) => item.id !== "ex03")) {
      // Ex 03 starts from the working Part 9 code on purpose (brief Part 9).
      expect(check(pyodide, exercise, exercise.starterCode).passed, exercise.id).toBe(false);
    }
  });

  describe("no-loop check", () => {
    const runs = [{ prelude: "import numpy as np\na = np.array([1, 2, 3])", reference: "import numpy as np\na = np.array([1, 2, 3])" }];
    const checks = [{ kind: "no-loop" as const }, { kind: "result" as const, name: "out", expression: "a * 2" }];

    it.each([
      ["a for loop", "out = np.array([0, 0, 0])\nfor i in range(3):\n    out[i] = a[i] * 2"],
      ["a while loop", "out = a.copy()\ni = 0\nwhile i < 3:\n    out[i] *= 2\n    i += 1"],
      ["a comprehension", "out = np.array([x * 2 for x in a])"],
    ])("rejects %s even when the values are right", (_label, code) => {
      const outcome = validateExercise(pyodide, code, runs, checks);
      expect(outcome.passed).toBe(false);
      expect(outcome.problems[0]).toContain("without a Python loop");
    });

    it("accepts the vectorized solution", () => {
      expect(validateExercise(pyodide, "out = a * 2", runs, checks)).toEqual({ passed: true, problems: [] });
    });
  });

  it("fails Ex 01 when a shape is wrong", () => {
    const solution = exerciseById("ex01").solution.replace("b_shape = b.shape", "b_shape = (2, 3)");
    const outcome = check(pyodide, exerciseById("ex01"), solution);

    expect(outcome.passed).toBe(false);
    expect(outcome.problems).toEqual(["b_shape has the wrong values."]);
  });

  it("gives each lesson with an exercise its exercise", () => {
    expect(findExerciseForLesson("06")?.id).toBe("ex02");
    expect(findExerciseForLesson("07")?.id).toBe("ex03");
    expect(findExerciseForLesson("08")?.id).toBe("ex04");
    expect(findExerciseForLesson("03")?.id).toBe("ex01");
  });

  it("fails Ex 02 when the result is missing", () => {
    const outcome = check(pyodide, exerciseById("ex02"), "print('no result')");

    expect(outcome.passed).toBe(false);
    expect(outcome.problems).toEqual(["result is missing. Create a variable named result."]);
  });

  it("fails Ex 02 for a hard-coded answer that only fits the visible inputs", () => {
    const outcome = check(pyodide, exerciseById("ex02"), "result = np.array([4, 10, 18])");

    expect(outcome.passed).toBe(false);
    expect(outcome.problems).toEqual(["result has the wrong values."]);
  });

  it("reports the expected and actual shape when the shape is wrong", () => {
    const outcome = check(pyodide, exerciseById("ex02"), "result = a[:2] * b[:2]");

    expect(outcome.problems).toEqual(["result has shape (2,), expected (3,)."]);
  });

  it("fails Ex 04 for a hard-coded answer that only fits the visible inputs", () => {
    const outcome = check(
      pyodide,
      exerciseById("ex04"),
      "out = np.array([[3, 5], [7, 9], [11, 13]])",
    );

    expect(outcome.passed).toBe(false);
    expect(outcome.problems).toEqual(["out has the wrong values."]);
  });

  it("accepts Ex 04 computed with the operations", () => {
    expect(check(pyodide, exerciseById("ex04"), "t = X * w\nout = t + b").passed).toBe(true);
  });

  it("fails Ex 03 when w was left with three values: the broadcasting error stops the code", () => {
    const code = "import numpy as np\nX = np.array([[1, 2], [3, 4], [5, 6]])\nw = np.array([2, 3, 4])\nout = X * w";
    const outcome = check(pyodide, exerciseById("ex03"), code);

    expect(outcome.passed).toBe(false);
    expect(outcome.problems[0]).toContain("ValueError");
  });

  it("fails Ex 03 when w is changed but the code still runs", () => {
    const code = "import numpy as np\nX = np.array([[1, 2], [3, 4], [5, 6]])\nw = np.array([2, 3])\nout = X * w\nw = np.array([1, 1])";
    const outcome = check(pyodide, exerciseById("ex03"), code);

    expect(outcome.problems).toEqual(["w must keep its starter value."]);
  });

  it("fails Ex 03 when X was changed, even if out is right", () => {
    const code = "import numpy as np\nX = np.array([[1, 2], [3, 4], [5, 6]]) * 1\nw = np.array([2, 3])\nX = X * 1\nout = X * w\nX = X + 1";
    const outcome = check(pyodide, exerciseById("ex03"), code);

    expect(outcome.problems).toContain("X must keep its starter value.");
  });

  it("reports the error when the learner's code stops", () => {
    const outcome = check(pyodide, exerciseById("ex02"), "result = a * undefined_name");

    expect(outcome.passed).toBe(false);
    expect(outcome.problems[0]).toContain("NameError");
  });
});
