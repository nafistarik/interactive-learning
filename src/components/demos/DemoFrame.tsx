import type { ReactNode } from "react";

import type { DemoRecording } from "./use-demo-recording";

/**
 * The box around every demo: title, the code it runs, controls, and the recorded result, with
 * loading and error states.
 *
 * @param props.title - Short demo title.
 * @param props.code - The Python the demo runs, shown so the learner sees the real code.
 * @param props.controls - The demo's inputs.
 * @param props.recording - The recording state, when the demo records code.
 * @param props.children - The view of the result, drawn when the recording is ready.
 */
export function DemoFrame({
  title,
  code,
  controls,
  recording,
  children,
}: {
  title: string;
  code?: string;
  controls: ReactNode;
  recording?: DemoRecording;
  children: ReactNode;
}) {
  return (
    <section aria-label={`Interactive demo: ${title}`} className="card grid gap-4 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-subtle">Interactive · runs real NumPy in your browser</span>
      </div>
      <div className="flex flex-wrap items-end gap-3 text-sm">{controls}</div>
      {code ? <pre className="overflow-x-auto rounded-md bg-surface-2 p-3 font-mono text-xs leading-5">{code}</pre> : null}
      <div aria-live="polite">
        {recording?.state === "loading" ? (
          <p className="text-sm text-subtle">
            {recording.runtime.state === "loading" && recording.runtime.stage === "numpy"
              ? "Loading NumPy…"
              : "Loading Python… The first load takes a few seconds."}
          </p>
        ) : recording?.state === "failed" ? (
          <p className="text-sm text-danger">{recording.error}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
