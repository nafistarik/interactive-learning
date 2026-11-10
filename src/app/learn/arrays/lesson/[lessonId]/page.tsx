import Link from "next/link";
import { notFound } from "next/navigation";

import PythonArena from "@/components/arena/PythonArena";
import { RememberLesson } from "@/components/progress/RememberLesson";
import { ARRAYS_MODULE, findLesson } from "@/data/arrays-module";
import { findExerciseForLesson } from "@/data/exercises";

/** Only the eight known lessons exist; any other id is a real 404 from the router. */
export const dynamicParams = false;

/** Prerenders the eight known lessons at build time. */
export function generateStaticParams() {
  return ARRAYS_MODULE.lessons.map((lesson) => ({ lessonId: lesson.id }));
}

/**
 * Learning workspace for one lesson (`/learn/arrays/lesson/[lessonId]`), brief Part 4.3.
 * An unknown lesson id renders the 404 page with a real 404 status. Theory is not built yet;
 * the Practice view shows the coding arena for lessons that have starter code.
 *
 * @param props.params - Route params; `lessonId` is the two-digit lesson id.
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = findLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  const exercise = findExerciseForLesson(lesson.id);
  const practiceStarter = exercise?.starterCode ?? lesson.starterCode;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <nav className="text-sm text-subtle">
        <Link href="/" className="underline">
          Dashboard
        </Link>{" "}
        /{" "}
        <Link href="/learn/arrays" className="underline">
          {ARRAYS_MODULE.title}
        </Link>{" "}
        / Lesson {lesson.id}
      </nav>
      <RememberLesson lessonId={lesson.id} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{lesson.title}</h1>
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-medium">Practice</h2>
        {practiceStarter ? (
          <PythonArena starterCode={practiceStarter} exercise={exercise} />
        ) : (
          <p className="text-muted">
            Practice for this lesson comes with its lesson content.
          </p>
        )}
      </section>
    </main>
  );
}
