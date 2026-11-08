import { describe, expect, it } from "vitest";

import { ARRAYS_MODULE, findLesson } from "@/data/arrays-module";

describe("ARRAYS_MODULE", () => {
  it("lists the eight lessons 01 to 08 in order", () => {
    expect(ARRAYS_MODULE.lessons.map((lesson) => lesson.id)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
    ]);
  });

  it("marks the four exercises on lessons 03, 06, 07 and 08", () => {
    const withExercise = ARRAYS_MODULE.lessons
      .filter((lesson) => lesson.hasExercise)
      .map((lesson) => lesson.id);

    expect(withExercise).toEqual(["03", "06", "07", "08"]);
  });
});

describe("findLesson", () => {
  it("returns the lesson for a valid id", () => {
    expect(findLesson("07")?.title).toBe("Understanding Broadcasting");
  });

  it.each(["00", "09", "7", "", "07 ", "../07", "constructor"])(
    "returns undefined for %j",
    (lessonId) => {
      expect(findLesson(lessonId)).toBeUndefined();
    },
  );
});
