import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonWorkspace } from "@/components/workspace/LessonWorkspace";
import { AVAILABLE_MODULES, findLesson, findModule } from "@/data/curriculum";

/** Only lessons of available modules exist; any other path is a real 404 from the router. */
export const dynamicParams = false;

/** Prerenders every lesson of every available module at build time. */
export function generateStaticParams() {
  return AVAILABLE_MODULES.flatMap((mod) =>
    mod.lessons.map((lesson) => ({ module: mod.slug, lessonId: lesson.id })),
  );
}

type Params = Promise<{ module: string; lessonId: string }>;

/** Page title per lesson. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { module: slug, lessonId } = await params;
  const mod = findModule(slug);
  const lesson = mod && findLesson(mod, lessonId);
  return { title: lesson ? `${lesson.id}. ${lesson.title} · Interactive Learning` : "Interactive Learning" };
}

/**
 * Learning workspace for one lesson (`/learn/[module]/lesson/[lessonId]`), brief Part 4.3.
 *
 * @param props.params - Route params: the module slug and the two-digit lesson id.
 */
export default async function LessonPage({ params }: { params: Params }) {
  const { module: slug, lessonId } = await params;
  const mod = findModule(slug);
  if (!mod || !findLesson(mod, lessonId)) {
    notFound();
  }
  // Keyed so moving to another lesson starts with fresh view state.
  return <LessonWorkspace key={`${slug}/${lessonId}`} moduleSlug={slug} lessonId={lessonId} />;
}
