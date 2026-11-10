import { describe, expect, it } from "vitest";

import {
  completionOf,
  emptyProgress,
  lessonStatusOf,
  markLessonCompleted,
  recordCheck,
  recordKnowledgeCheck,
  recordHintUsed,
  setCurrentLesson,
  starsFor,
  totalsOf,
} from "@/features/progress/model";

describe("starsFor (brief Part 11)", () => {
  it("gives 3 stars for a pass with no hint within 3 attempts", () => {
    expect(starsFor(1, false)).toBe(3);
    expect(starsFor(3, false)).toBe(3);
  });

  it("gives 2 stars when a hint was used, whatever the attempts", () => {
    expect(starsFor(1, true)).toBe(2);
  });

  it("gives 2 stars for 4 to 6 attempts without a hint", () => {
    expect(starsFor(4, false)).toBe(2);
    expect(starsFor(6, false)).toBe(2);
  });

  it("gives 1 star otherwise", () => {
    expect(starsFor(7, false)).toBe(1);
  });
});

describe("recordCheck", () => {
  it("counts failed checks and passes on the pass", () => {
    let state = recordCheck(emptyProgress(), "ex02", false);
    state = recordCheck(state, "ex02", false);
    state = recordCheck(state, "ex02", true);

    expect(state.exercises.ex02).toEqual({ passed: true, attempts: 3, hintUsed: false, stars: 3 });
  });

  it("fixes the stars at the pass; later checks do not change them", () => {
    let state = recordCheck(emptyProgress(), "ex02", true);
    state = recordCheck(state, "ex02", false);

    expect(state.exercises.ex02.stars).toBe(3);
    expect(state.exercises.ex02.attempts).toBe(1);
  });

  it("uses a hint opened before the pass", () => {
    let state = recordHintUsed(emptyProgress(), "ex04");
    state = recordCheck(state, "ex04", true);

    expect(state.exercises.ex04).toMatchObject({ passed: true, hintUsed: true, stars: 2 });
  });
});

describe("recordHintUsed", () => {
  it("is ignored once the exercise has passed", () => {
    const passed = recordCheck(emptyProgress(), "ex02", true);

    expect(recordHintUsed(passed, "ex02")).toBe(passed);
  });
});

describe("totalsOf", () => {
  it("gives XP per completed lesson and per passed exercise, each once", () => {
    let state = markLessonCompleted(emptyProgress(), "01");
    state = markLessonCompleted(state, "01");
    state = recordCheck(state, "ex02", true);
    state = recordCheck(state, "ex02", true);

    expect(totalsOf(state)).toEqual({
      xp: 150,
      stars: 3,
      completedLessons: 1,
      passedExercises: 1,
    });
  });

  it("is zero for a fresh progress", () => {
    expect(totalsOf(emptyProgress())).toEqual({
      xp: 0,
      stars: 0,
      completedLessons: 0,
      passedExercises: 0,
    });
  });
});

describe("lessonStatusOf", () => {
  it("shows exercise passed before the lesson is completed", () => {
    const passed = recordCheck(emptyProgress(), "ex02", true);

    expect(lessonStatusOf(passed, "06", "ex02")).toBe("in-progress");
    expect(lessonStatusOf(markLessonCompleted(passed, "06"), "06", "ex02")).toBe("completed");
    expect(lessonStatusOf(passed, "01", undefined)).toBe("not-started");
  });
});

describe("setCurrentLesson", () => {
  it("remembers the lesson the learner opened", () => {
    expect(setCurrentLesson(emptyProgress(), "07").currentLesson).toBe("07");
  });
});

describe("lesson completion (brief Part 11)", () => {
  it("completes a lesson without an exercise when its check passes", () => {
    const state = recordKnowledgeCheck(emptyProgress(), "01", undefined);

    expect(state.completedLessons).toEqual(["01"]);
    expect(totalsOf(state).xp).toBe(50);
  });

  it("waits for the exercise when the check passes first", () => {
    let state = recordKnowledgeCheck(emptyProgress(), "06", "ex02");
    expect(state.completedLessons).toEqual([]);
    expect(lessonStatusOf(state, "06", "ex02")).toBe("in-progress");

    state = recordCheck(state, "ex02", true);
    state = recordKnowledgeCheck(state, "06", "ex02");
    expect(state.completedLessons).toEqual(["06"]);
    expect(totalsOf(state).xp).toBe(150);
  });

  it("never counts a repeated check twice", () => {
    let state = recordKnowledgeCheck(emptyProgress(), "01", undefined);
    state = recordKnowledgeCheck(state, "01", undefined);

    expect(state.passedChecks).toEqual(["01"]);
    expect(totalsOf(state).xp).toBe(50);
  });
});

describe("completionOf (brief Part 11: completed lessons over the module's lessons)", () => {
  const keys = ["arrays/01", "arrays/02", "arrays/03", "arrays/04", "arrays/05", "arrays/06", "arrays/07", "arrays/08"];

  it("counts only this module's lessons", () => {
    let state = recordKnowledgeCheck(emptyProgress(), "arrays/01", undefined);
    state = recordKnowledgeCheck(state, "matmul/01", undefined);

    expect(completionOf(state, keys)).toEqual({ completed: 1, percent: 13 });
  });

  it("is zero for an empty module", () => {
    expect(completionOf(emptyProgress(), [])).toEqual({ completed: 0, percent: 0 });
  });
});
