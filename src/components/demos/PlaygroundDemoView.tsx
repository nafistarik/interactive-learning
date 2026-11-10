"use client";

import { useState } from "react";

import { ArrayGrid } from "@/components/visualization/ArrayGrid";
import { FrameVisualizer } from "@/components/visualization/FrameVisualizer";
import type { PlaygroundDemo } from "@/features/content/types";
import { clampNumber, fillTemplate, initialValues } from "@/features/demos/playground";

import { FIELD } from "./ArrayDemos";
import { DemoFrame } from "./DemoFrame";
import { finalArray, useDemoRecording } from "./use-demo-recording";

/**
 * A data-defined demo (R2 brief). The controls fill the template, the real recorder runs it,
 * and the last frame with a recorded operation is drawn by the shared visualizations; when
 * there is none, the listed variables are drawn.
 *
 * @param props.demo - The demo from the lesson data.
 */
export function PlaygroundDemoView({ demo }: { demo: PlaygroundDemo }) {
  const [values, setValues] = useState(() => initialValues(demo));
  const code = fillTemplate(demo, values);
  const recording = useDemoRecording(code);
  const frames = recording.state === "ready" ? recording.frames : [];
  const operationFrame = [...frames].reverse().find((frame) => frame.operations.length > 0);
  const failed = frames.at(-1)?.status === "error" ? frames.at(-1) : undefined;

  return (
    <DemoFrame
      title={demo.title}
      code={code}
      recording={recording}
      controls={demo.controls.map((control) => (
        <label key={control.name} className="grid gap-1 text-xs text-subtle">
          {control.label}
          {control.type === "select" ? (
            <select
              value={values[control.name]}
              onChange={(event) => setValues({ ...values, [control.name]: Number(event.target.value) })}
              className={FIELD}
            >
              {control.options.map((option, index) => (
                <option key={option.label} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              min={control.min}
              max={control.max}
              step={1}
              value={values[control.name]}
              onChange={(event) =>
                setValues({ ...values, [control.name]: clampNumber(control, Number(event.target.value)) })
              }
              className={`${FIELD} w-20`}
            />
          )}
        </label>
      ))}
    >
      <div className="grid gap-3">
        {operationFrame ? (
          <FrameVisualizer key={code} frame={operationFrame} paused={false} speed={1.5} />
        ) : (
          (demo.show ?? []).map((name) => {
            const array = finalArray(frames, name);
            return array ? <ArrayGrid key={name} label={name} snapshot={array} tone="result" /> : null;
          })
        )}
        {failed && !failed.operations.length ? (
          <p className="text-sm text-danger">
            {failed.error?.type}: {failed.error?.message}
          </p>
        ) : null}
        {frames.some((frame) => frame.stdout) ? (
          <pre className="overflow-x-auto rounded-md border border-line bg-surface p-3 font-mono text-sm">
            {frames.map((frame) => frame.stdout).join("").trimEnd()}
          </pre>
        ) : null}
      </div>
    </DemoFrame>
  );
}
