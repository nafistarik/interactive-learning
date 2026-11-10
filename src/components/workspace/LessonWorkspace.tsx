"use client";

import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { ARRAYS_MODULE, findLesson } from "@/data/arrays-module";
import { findExerciseForLesson } from "@/data/exercises";
import { findLessonContent } from "@/data/lessons";
import { LESSON_STATUS_TEXT } from "@/data/ui-text";
import { PythonRuntimeProvider } from "@/features/execution/python-runtime-context";
import { lessonStatusOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

import { LessonSidebar } from "./LessonSidebar";
import { PracticeView } from "./PracticeView";
import { TheoryView } from "./TheoryView";

/** The two views of a lesson (brief Part 4.3). */
const VIEWS = ["theory", "practice"] as const;
type View = (typeof VIEWS)[number];

/**
 * Learning workspace of one lesson (brief Part 4.3): breadcrumbs, lesson progress,
 * previous/next, a collapsible lesson sidebar, and the Theory and Practice views. Practice is
 * mounted the first time it opens and then kept, so switching views keeps the code and frames.
 *
 * @param props.lessonId - A valid lesson id (the route has already 404ed unknown ids).
 */
export function LessonWorkspace({ lessonId }: { lessonId: string }) {
  const lesson = findLesson(lessonId);
  const content = findLessonContent(lessonId);
  const exercise = findExerciseForLesson(lessonId);
  const { state, loaded, visitLesson } = useProgress();
  const [view, setView] = useState<View>("theory");
  const [practiceOpened, setPracticeOpened] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const tabRefs = useRef<Record<View, HTMLButtonElement | null>>({ theory: null, practice: null });

  useEffect(() => {
    visitLesson(lessonId);
  }, [lessonId, visitLesson]);

  if (!lesson || !content) {
    return null;
  }

  const position = ARRAYS_MODULE.lessons.findIndex((item) => item.id === lessonId);
  const previous = ARRAYS_MODULE.lessons[position - 1];
  const next = ARRAYS_MODULE.lessons[position + 1];
  const status = lessonStatusOf(state, lessonId, exercise?.id);
  const checkPassed = state.passedChecks.includes(lessonId);
  const exerciseProgress = exercise ? state.exercises[exercise.id] : undefined;

  /** Opens a view, mounting Practice the first time. */
  function open(target: View) {
    setView(target);
    if (target === "practice") {
      setPracticeOpened(true);
    }
  }

  /** Arrow keys move between the two tabs (WAI-ARIA tabs pattern). */
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    event.preventDefault();
    const target = view === "theory" ? "practice" : "theory";
    open(target);
    tabRefs.current[target]?.focus();
  }

  return (
    <PythonRuntimeProvider>
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1">
        {sidebarOpen ? (
          <aside className="hidden w-64 shrink-0 border-r border-line px-3 py-6 md:block">
            <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-subtle">
              {ARRAYS_MODULE.title}
            </p>
            <LessonSidebar currentId={lessonId} />
          </aside>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              aria-label={sidebarOpen ? "Hide lesson list" : "Show lesson list"}
              aria-expanded={sidebarOpen}
              className="btn-ghost hidden size-8 justify-center p-0 md:inline-flex"
            >
              {sidebarOpen ? <PanelLeftClose className="size-4" aria-hidden /> : <PanelLeftOpen className="size-4" aria-hidden />}
            </button>
            <nav aria-label="Breadcrumb" className="min-w-0 flex-1 text-subtle">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/learn/arrays" className="hover:text-fg">
                    {ARRAYS_MODULE.title}
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li aria-current="page" className="text-fg">
                  Lesson {lesson.id}
                </li>
              </ol>
            </nav>
            <div className="flex items-center gap-1">
              {previous ? (
                <Link href={`/learn/arrays/lesson/${previous.id}`} className="btn-ghost" aria-label={`Previous lesson: ${previous.title}`}>
                  <ChevronLeft className="size-4" aria-hidden /> Previous
                </Link>
              ) : null}
              {next ? (
                <Link href={`/learn/arrays/lesson/${next.id}`} className="btn-ghost" aria-label={`Next lesson: ${next.title}`}>
                  Next <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : null}
            </div>
          </div>

          <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="font-mono text-xs text-subtle">
                Lesson {lesson.id} of {ARRAYS_MODULE.lessons.length} · about {content.estimatedMinutes} min
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
              <p className="mt-1 text-muted">{content.summary}</p>
            </div>
            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Lesson progress">
              <div className="flex gap-1.5">
                <dt className="text-subtle">Status</dt>
                <dd className="font-medium">{loaded ? LESSON_STATUS_TEXT[status] : "–"}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-subtle">Knowledge check</dt>
                <dd className="font-medium">{loaded ? (checkPassed ? "Passed" : "Not yet") : "–"}</dd>
              </div>
              {exercise ? (
                <div className="flex gap-1.5">
                  <dt className="text-subtle">Exercise</dt>
                  <dd className="font-medium">
                    {loaded
                      ? exerciseProgress?.passed
                        ? `Passed ${"★".repeat(exerciseProgress.stars)}${"☆".repeat(3 - exerciseProgress.stars)}`
                        : "Not yet"
                      : "–"}
                  </dd>
                </div>
              ) : null}
            </dl>
          </header>

          <div role="tablist" aria-label="Lesson views" className="mt-6 flex gap-1 border-b border-line">
            {VIEWS.map((item) => (
              <button
                key={item}
                ref={(element) => {
                  tabRefs.current[item] = element;
                }}
                type="button"
                role="tab"
                id={`tab-${item}`}
                aria-selected={view === item}
                aria-controls={`panel-${item}`}
                tabIndex={view === item ? 0 : -1}
                onClick={() => open(item)}
                onKeyDown={onTabKey}
                className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium capitalize ${
                  view === item ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div role="tabpanel" id="panel-theory" aria-labelledby="tab-theory" hidden={view !== "theory"} className="pt-6">
            <TheoryView content={content} exerciseId={exercise?.id} onOpenPractice={() => open("practice")} />
          </div>
          <div role="tabpanel" id="panel-practice" aria-labelledby="tab-practice" hidden={view !== "practice"} className="pt-6">
            {practiceOpened ? <PracticeView lessonId={lessonId} content={content} exercise={exercise} /> : null}
          </div>

          <nav aria-label="Lesson navigation" className="mt-12 flex justify-between gap-4 border-t border-line pt-6 text-sm">
            {previous ? (
              <Link href={`/learn/arrays/lesson/${previous.id}`} className="group grid">
                <span className="text-subtle">Previous</span>
                <span className="font-medium group-hover:underline">{previous.id}. {previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/learn/arrays/lesson/${next.id}`} className="group grid text-right">
                <span className="text-subtle">Next</span>
                <span className="font-medium group-hover:underline">{next.id}. {next.title}</span>
              </Link>
            ) : (
              <Link href="/progress" className="group grid text-right">
                <span className="text-subtle">Module finished?</span>
                <span className="font-medium group-hover:underline">See your progress</span>
              </Link>
            )}
          </nav>
        </main>
      </div>
    </PythonRuntimeProvider>
  );
}
