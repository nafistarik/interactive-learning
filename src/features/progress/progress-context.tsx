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
import { LEGACY_PROGRESS_KEY, loadProgress, PROGRESS_KEY, saveProgress } from "@/lib/storage/progress-storage";

import {
  emptyProgress,
  completeIfReady,
  recordCheck,
  recordKnowledgeCheck,
  recordHintUsed,
  setCurrentLesson,
  type ProgressState,
} from "./model";

/** Actions that change the progress. */
type ProgressAction =
  | { type: "load"; state: ProgressState }
  | { type: "check"; exerciseId: string; lessonId: string; passed: boolean }
  | { type: "knowledge"; lessonId: string; exerciseId: string | undefined }
  | { type: "hint"; exerciseId: string }
  | { type: "visit"; lessonId: string }
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
      return completeIfReady(
        recordCheck(state, action.exerciseId, action.passed),
        action.lessonId,
        action.exerciseId,
      );
    case "knowledge":
      return recordKnowledgeCheck(state, action.lessonId, action.exerciseId);
    case "hint":
      return recordHintUsed(state, action.exerciseId);
    case "visit":
      return setCurrentLesson(state, action.lessonId);
    case "reset":
      return emptyProgress();
  }
}

/** What the pages can read and change. */
export interface ProgressContextValue {
  state: ProgressState;
  /** False until the saved progress has been read, so pages do not flash zeros as data. */
  loaded: boolean;
  /** Records one exercise check; `lessonId` is the exercise's lesson, completed if it qualifies. */
  recordCheck: (exerciseId: string, lessonId: string, passed: boolean) => void;
  /** Records a passed knowledge check; completes the lesson if it qualifies. */
  passKnowledgeCheck: (lessonId: string, exerciseId: string | undefined) => void;
  recordHint: (exerciseId: string) => void;
  visitLesson: (lessonId: string) => void;
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
    (exerciseId: string, lessonId: string, passed: boolean) =>
      dispatch({ type: "check", exerciseId, lessonId, passed }),
    [],
  );
  const recordHint = useCallback((exerciseId: string) => dispatch({ type: "hint", exerciseId }), []);
  const visitLesson = useCallback((lessonId: string) => dispatch({ type: "visit", lessonId }), []);
  const passKnowledgeCheck = useCallback(
    (lessonId: string, exerciseId: string | undefined) =>
      dispatch({ type: "knowledge", lessonId, exerciseId }),
    [],
  );
  const reset = useCallback(() => {
    removeStoredValue(getBrowserStorage(), PROGRESS_KEY);
    removeStoredValue(getBrowserStorage(), LEGACY_PROGRESS_KEY);
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
      passKnowledgeCheck,
      reset,
    }),
    [state, loaded, recordCheckAction, recordHint, visitLesson, passKnowledgeCheck, reset],
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
