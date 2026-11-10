import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonWorkspace } from "@/components/workspace/LessonWorkspace";
import { ARRAYS_MODULE, findLesson } from "@/data/arrays-module";

/** Only the eight known lessons exist; any other id is a real 404 from the router. */
export const dynamicParams = false;

/** Prerenders the eight known lessons at build time. */
export function generateStaticParams() {
  return ARRAYS_MODULE.lessons.map((lesson) => ({ lessonId: lesson.id }));
}

/** Page title per lesson. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}): Promise<Metadata> {
  const lesson = findLesson((await params).lessonId);
  return { title: lesson ? `${lesson.id}. ${lesson.title} · Interactive Learning` : "Interactive Learning" };
}

/**
 * Learning workspace for one lesson (`/learn/arrays/lesson/[lessonId]`), brief Part 4.3.
 * An unknown lesson id renders the 404 page with a real 404 status.
 *
 * @param props.params - Route params; `lessonId` is the two-digit lesson id.
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  if (!findLesson(lessonId)) {
    notFound();
  }
  // Keyed so moving to another lesson starts with fresh view state.
  return <LessonWorkspace key={lessonId} lessonId={lessonId} />;
}
