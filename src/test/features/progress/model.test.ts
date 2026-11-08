import { describe, expect, it } from "vitest";

import {
  emptyProgress,
  lessonStatusOf,
  markLessonCompleted,
  recordCheck,
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
      modulePercent: 13,
    });
  });

  it("is zero for a fresh progress", () => {
    expect(totalsOf(emptyProgress())).toEqual({
      xp: 0,
      stars: 0,
      completedLessons: 0,
      passedExercises: 0,
      modulePercent: 0,
    });
  });
});

describe("lessonStatusOf", () => {
  it("shows exercise passed before the lesson is completed", () => {
    const passed = recordCheck(emptyProgress(), "ex02", true);

    expect(lessonStatusOf(passed, "06", "ex02")).toBe("exercise-passed");
    expect(lessonStatusOf(markLessonCompleted(passed, "06"), "06", "ex02")).toBe("completed");
    expect(lessonStatusOf(passed, "01", undefined)).toBe("not-started");
  });
});

describe("setCurrentLesson", () => {
  it("remembers the lesson the learner opened", () => {
    expect(setCurrentLesson(emptyProgress(), "07").currentLesson).toBe("07");
  });
});
