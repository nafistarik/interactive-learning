"use client";

import { useEffect } from "react";

import { useProgress } from "@/features/progress/progress-context";

/**
 * Records that the learner opened this lesson, so "Continue learning" can return to it. Renders
 * nothing.
 *
 * @param props.lessonId - The lesson's two-digit id.
 */
export function RememberLesson({ lessonId }: { lessonId: string }) {
  const { visitLesson } = useProgress();
  useEffect(() => {
    visitLesson(lessonId);
  }, [lessonId, visitLesson]);
  return null;
}
