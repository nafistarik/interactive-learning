"use client";

import { useEffect, useState } from "react";

import type { ArraySnapshot, ExecutionFrame } from "@/features/execution/frames";
import type { RuntimeStatus } from "@/features/execution/python-client";
import { usePythonRuntime } from "@/features/execution/python-runtime-context";

/** What a demo shows: still loading, the recorded frames, or why recording failed. */
export type DemoRecording =
  | { state: "loading"; runtime: RuntimeStatus }
  | { state: "ready"; frames: ExecutionFrame[] }
  | { state: "failed"; error: string };

/** Delay before recording after the controls change, so typing does not queue many runs. */
const DEBOUNCE_MS = 200;

/**
 * Records demo code with the lesson's Python runtime whenever the code changes. Only the latest
 * code's result is kept.
 *
 * @param code - The demo code, built from the controls.
 * @returns The recording state.
 */
export function useDemoRecording(code: string): DemoRecording {
  const { client, runtime } = usePythonRuntime();
  const [result, setResult] = useState<{ code: string; recording: DemoRecording } | null>(null);

  useEffect(() => {
    if (!client) {
      return;
    }
    let current = true;
    const timer = setTimeout(async () => {
      const outcome = await client.record(code);
      if (current) {
        setResult({
          code,
          recording: outcome.ok ? { state: "ready", frames: outcome.frames } : { state: "failed", error: outcome.error },
        });
      }
    }, DEBOUNCE_MS);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [client, code]);

  if (runtime.state === "failed") {
    return { state: "failed", error: "Python could not load. Reload the page to try again." };
  }
  // Keep showing the previous result while the next one records, so the view does not flicker.
  return result?.recording ?? { state: "loading", runtime };
}

/**
 * The array a variable holds after the last recorded frame.
 *
 * @param frames - The recorded frames.
 * @param name - The variable name.
 * @returns Its array snapshot, or `undefined`.
 */
export function finalArray(frames: ExecutionFrame[], name: string): ArraySnapshot | undefined {
  return frames[frames.length - 1]?.variables.find((variable) => variable.name === name)?.array;
}
