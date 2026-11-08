"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getBrowserStorage, removeStoredValue } from "@/lib/storage/local-storage";
import { loadProgress, PROGRESS_KEY, saveProgress } from "@/lib/storage/progress-storage";

import {
  emptyProgress,
  markLessonCompleted,
  recordCheck,
  recordHintUsed,
  setCurrentLesson,
  type ProgressState,
} from "./model";

/** Actions that change the progress. */
type ProgressAction =
  | { type: "load"; state: ProgressState }
  | { type: "check"; exerciseId: string; passed: boolean }
  | { type: "hint"; exerciseId: string }
  | { type: "visit"; lessonId: string }
  | { type: "complete"; lessonId: string }
  | { type: "reset" };

/**
 * Applies one action to the progress.
 *
 * @param state - The current progress.
 * @param action - What happened.
 * @returns The new progress.
 */
function reducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case "load":
      return action.state;
    case "check":
      return recordCheck(state, action.exerciseId, action.passed);
    case "hint":
      return recordHintUsed(state, action.exerciseId);
    case "visit":
      return setCurrentLesson(state, action.lessonId);
    case "complete":
      return markLessonCompleted(state, action.lessonId);
    case "reset":
      return emptyProgress();
  }
}

/** What the pages can read and change. */
export interface ProgressContextValue {
  state: ProgressState;
  /** False until the saved progress has been read, so pages do not flash zeros as data. */
  loaded: boolean;
  recordCheck: (exerciseId: string, passed: boolean) => void;
  recordHint: (exerciseId: string) => void;
  visitLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/**
 * Keeps the progress for the whole app and saves it to LocalStorage (brief Part 11). The saved
 * progress is read after the first render, so the server HTML and the first client render match.
 *
 * @param props.children - The app.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const loadedRef = useRef(false);
  const resettingRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) {
      return;
    }
    loadedRef.current = true;
    dispatch({ type: "load", state: loadProgress(getBrowserStorage()) });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (resettingRef.current) {
      resettingRef.current = false;
      return;
    }
    saveProgress(getBrowserStorage(), state);
  }, [state, loaded]);

  const recordCheckAction = useCallback(
    (exerciseId: string, passed: boolean) => dispatch({ type: "check", exerciseId, passed }),
    [],
  );
  const recordHint = useCallback((exerciseId: string) => dispatch({ type: "hint", exerciseId }), []);
  const visitLesson = useCallback((lessonId: string) => dispatch({ type: "visit", lessonId }), []);
  const completeLesson = useCallback((lessonId: string) => dispatch({ type: "complete", lessonId }), []);
  const reset = useCallback(() => {
    removeStoredValue(getBrowserStorage(), PROGRESS_KEY);
    resettingRef.current = true;
    dispatch({ type: "reset" });
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      loaded,
      recordCheck: recordCheckAction,
      recordHint,
      visitLesson,
      completeLesson,
      reset,
    }),
    [state, loaded, recordCheckAction, recordHint, visitLesson, completeLesson, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

/**
 * The progress context. Must be used inside {@link ProgressProvider}.
 *
 * @returns The progress and its actions.
 * @throws When used outside the provider.
 */
export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return context;
}
