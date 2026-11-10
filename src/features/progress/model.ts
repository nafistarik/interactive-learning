/**
 * Progress model (brief Part 11). Pure functions only: the page keeps the state and the
 * storage layer saves it. XP and totals are derived from the completed sets, so an award can
 * never be counted twice.
 */

/** Progress of one exercise. Stars are kept for the best pass. */
export interface ExerciseProgress {
  passed: boolean;
  /** Checks run on this exercise until it passed. */
  attempts: number;
  /** Whether the hint was opened before the pass. */
  hintUsed: boolean;
  stars: 0 | 1 | 2 | 3;
}

/**
 * The whole saved progress, version 2. Lessons are keyed `"<module>/<lesson>"` (e.g.
 * `"arrays/07"`); exercise ids are unique across modules.
 */
export interface ProgressState {
  version: 2;
  /** Key of the lesson the learner is on. */
  currentLesson: string | null;
  completedLessons: string[];
  /** Lesson keys whose knowledge check passed (every question answered correctly). */
  passedChecks: string[];
  exercises: Record<string, ExerciseProgress>;
}

/** XP per completed lesson and per passed exercise (brief Part 11). */
export const XP_PER_LESSON = 50;
export const XP_PER_EXERCISE = 100;

/**
 * A fresh, empty progress.
 *
 * @returns The empty state.
 */
export function emptyProgress(): ProgressState {
  return { version: 2, currentLesson: null, completedLessons: [], passedChecks: [], exercises: {} };
}

/**
 * Stars for a passed exercise (brief Part 11): 3 with no hint within 3 attempts; 2 with a hint
 * or 4 to 6 attempts; 1 otherwise.
 *
 * @param attempts - Checks run up to and including the passing one.
 * @param hintUsed - Whether the hint was opened.
 * @returns The stars, 1 to 3.
 */
export function starsFor(attempts: number, hintUsed: boolean): 1 | 2 | 3 {
  if (!hintUsed && attempts <= 3) {
    return 3;
  }
  if (hintUsed || attempts <= 6) {
    return 2;
  }
  return 1;
}

/**
 * Records one check of an exercise. A pass fixes the stars from the attempts and hint use; a
 * later pass keeps the better stars. Failed checks only add to the attempt count.
 *
 * @param state - The current progress.
 * @param exerciseId - The exercise that was checked.
 * @param passed - Whether this check passed.
 * @returns The new progress.
 */
export function recordCheck(state: ProgressState, exerciseId: string, passed: boolean): ProgressState {
  const current = state.exercises[exerciseId] ?? { passed: false, attempts: 0, hintUsed: false, stars: 0 };
  if (current.passed) {
    return state;
  }
  const attempts = current.attempts + 1;
  const next: ExerciseProgress = passed
    ? { passed: true, attempts, hintUsed: current.hintUsed, stars: starsFor(attempts, current.hintUsed) }
    : { ...current, attempts };
  return { ...state, exercises: { ...state.exercises, [exerciseId]: next } };
}

/**
 * Notes that the hint was opened for an exercise that has not passed yet.
 *
 * @param state - The current progress.
 * @param exerciseId - The exercise whose hint was opened.
 * @returns The new progress.
 */
export function recordHintUsed(state: ProgressState, exerciseId: string): ProgressState {
  const current = state.exercises[exerciseId] ?? { passed: false, attempts: 0, hintUsed: false, stars: 0 };
  if (current.passed || current.hintUsed) {
    return state;
  }
  return {
    ...state,
    exercises: { ...state.exercises, [exerciseId]: { ...current, hintUsed: true } },
  };
}

/**
 * Remembers the lesson the learner is on, so "Continue learning" can open it.
 *
 * @param state - The current progress.
 * @param lessonId - The lesson's two-digit id.
 * @returns The new progress.
 */
export function setCurrentLesson(state: ProgressState, lessonId: string): ProgressState {
  return state.currentLesson === lessonId ? state : { ...state, currentLesson: lessonId };
}

/**
 * Marks a lesson complete without checking why. Prefer {@link completeIfReady}.
 *
 * @param state - The current progress.
 * @param lessonId - The lesson's two-digit id.
 * @returns The new progress.
 */
export function markLessonCompleted(state: ProgressState, lessonId: string): ProgressState {
  if (state.completedLessons.includes(lessonId)) {
    return state;
  }
  return { ...state, completedLessons: [...state.completedLessons, lessonId] };
}

/** Totals shown on the dashboard and the progress page. */
export interface ProgressTotals {
  xp: number;
  stars: number;
  completedLessons: number;
  passedExercises: number;
}

/**
 * Totals derived from the state.
 *
 * @param state - The current progress.
 * @returns The totals.
 */
export function totalsOf(state: ProgressState): ProgressTotals {
  const passed = Object.values(state.exercises).filter((exercise) => exercise.passed);
  const completedLessons = state.completedLessons.length;
  return {
    xp: completedLessons * XP_PER_LESSON + passed.length * XP_PER_EXERCISE,
    stars: passed.reduce((sum, exercise) => sum + exercise.stars, 0),
    completedLessons,
    passedExercises: passed.length,
  };
}

/**
 * Completion of one module (brief Part 11: completed lessons ÷ lessons in the module).
 *
 * @param state - The current progress.
 * @param lessonKeys - Keys of every lesson of the module.
 * @returns Completed lesson count and the whole percentage.
 */
export function completionOf(state: ProgressState, lessonKeys: string[]): { completed: number; percent: number } {
  const completed = lessonKeys.filter((key) => state.completedLessons.includes(key)).length;
  return { completed, percent: lessonKeys.length === 0 ? 0 : Math.round((completed / lessonKeys.length) * 100) };
}

/** What a lesson's row says on the module and progress pages. */
export type LessonStatus = "not-started" | "in-progress" | "completed";

/**
 * Status of one lesson: completed (see {@link completeIfReady}), in progress when only one of its
 * check and exercise passed, or not started.
 *
 * @param state - The current progress.
 * @param lessonId - The lesson's two-digit id.
 * @param exerciseId - The lesson's exercise id, if it has one.
 * @returns The status.
 */
export function lessonStatusOf(
  state: ProgressState,
  lessonId: string,
  exerciseId: string | undefined,
): LessonStatus {
  if (state.completedLessons.includes(lessonId)) {
    return "completed";
  }
  if (state.passedChecks.includes(lessonId) || (exerciseId && state.exercises[exerciseId]?.passed)) {
    return "in-progress";
  }
  return "not-started";
}

/**
 * Completes a lesson once it qualifies (brief Part 11): its knowledge check passed and, if it
 * has an exercise, the exercise passed.
 *
 * @param state - The current progress.
 * @param lessonId - The lesson's two-digit id.
 * @param exerciseId - The lesson's exercise id, if it has one.
 * @returns The new progress.
 */
export function completeIfReady(
  state: ProgressState,
  lessonId: string,
  exerciseId: string | undefined,
): ProgressState {
  const checkPassed = state.passedChecks.includes(lessonId);
  const exerciseDone = exerciseId === undefined || state.exercises[exerciseId]?.passed === true;
  return checkPassed && exerciseDone ? markLessonCompleted(state, lessonId) : state;
}

/**
 * Records that a lesson's knowledge check passed, and completes the lesson if it now qualifies.
 *
 * @param state - The current progress.
 * @param lessonId - The lesson's two-digit id.
 * @param exerciseId - The lesson's exercise id, if it has one.
 * @returns The new progress.
 */
export function recordKnowledgeCheck(
  state: ProgressState,
  lessonId: string,
  exerciseId: string | undefined,
): ProgressState {
  const next = state.passedChecks.includes(lessonId)
    ? state
    : { ...state, passedChecks: [...state.passedChecks, lessonId] };
  return completeIfReady(next, lessonId, exerciseId);
}
