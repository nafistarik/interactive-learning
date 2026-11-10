"use client";

import { useState } from "react";

import { ArrayGrid, formatShape } from "@/components/visualization/ArrayGrid";
import {
  dimensionsCode,
  DIMENSION_CHOICES,
  editArrayCode,
  indexingCode,
  INDEX_COLS,
  INDEX_ROWS,
  SHAPE_CHOICES,
  shapePickerCode,
  type Selection,
} from "@/features/demos/demo-code";

import { DemoFrame } from "./DemoFrame";
import { finalArray, useDemoRecording } from "./use-demo-recording";

/** Shared look of the small form controls in demos. */
export const FIELD = "rounded-md border border-line-strong bg-surface px-2 py-1 font-mono text-sm";

/** Lesson 01: edit the values of an array and watch the recorded array change. */
export function EditArrayDemo() {
  const [texts, setTexts] = useState(["3", "1", "4", "1", "5"]);
  const values = texts.map(Number);
  const valid = texts.every((text) => text.trim() !== "" && Number.isFinite(Number(text)));
  // shortcut: invalid input keeps the last valid code, so the view shows the previous array.
  const [lastValid, setLastValid] = useState(values);
  if (valid && values.some((value, index) => value !== lastValid[index])) {
    setLastValid(values);
  }
  const code = editArrayCode(lastValid);
  const recording = useDemoRecording(code);
  const a = recording.state === "ready" ? finalArray(recording.frames, "a") : undefined;

  return (
    <DemoFrame
      title="Edit an array"
      code={code}
      recording={recording}
      controls={
        <>
          {texts.map((text, index) => (
            <label key={index} className="grid gap-1 text-xs text-subtle">
              a[{index}]
              <input
                inputMode="decimal"
                value={text}
                onChange={(event) => setTexts(texts.map((item, at) => (at === index ? event.target.value : item)))}
                className={`${FIELD} w-16`}
                aria-invalid={!Number.isFinite(Number(text)) || text.trim() === ""}
              />
            </label>
          ))}
          {valid ? null : <span className="text-xs text-danger">Enter a number in every box.</span>}
        </>
      }
    >
      {a ? <ArrayGrid label="a" snapshot={a} tone="input" showIndices /> : null}
    </DemoFrame>
  );
}

/** Lesson 02: switch between 1, 2 and 3 dimensions; 3D shows as stacked 2D layers. */
export function DimensionsDemo() {
  const [ndim, setNdim] = useState<keyof typeof DIMENSION_CHOICES>(2);
  const code = dimensionsCode(ndim);
  const recording = useDemoRecording(code);
  const a = recording.state === "ready" ? finalArray(recording.frames, "a") : undefined;
  const axes = a?.shape.map((size, axis) => `axis ${axis}: ${size}`).join(" · ");

  return (
    <DemoFrame
      title="Change the number of dimensions"
      code={code}
      recording={recording}
      controls={
        <fieldset className="flex gap-1" aria-label="Dimensions">
          {([1, 2, 3] as const).map((option) => (
            <label key={option} className={`btn cursor-pointer ${ndim === option ? "border-accent bg-accent-soft" : ""}`}>
              <input
                type="radio"
                name="dimensions"
                className="sr-only"
                checked={ndim === option}
                onChange={() => setNdim(option)}
              />
              {option}D
            </label>
          ))}
        </fieldset>
      }
    >
      {a ? (
        <div className="grid gap-2">
          <ArrayGrid label="a" snapshot={a} tone="input" />
          <p className="font-mono text-xs text-subtle">{axes}</p>
        </div>
      ) : null}
    </DemoFrame>
  );
}

/** Lesson 03: pick a structure and read its shape, size and ndim. */
export function ShapePickerDemo() {
  const [choice, setChoice] = useState<(typeof SHAPE_CHOICES)[number]["id"]>("table23");
  const code = shapePickerCode(choice);
  const recording = useDemoRecording(code);
  const x = recording.state === "ready" ? finalArray(recording.frames, "x") : undefined;

  return (
    <DemoFrame
      title="Pick a structure, see its shape"
      code={code}
      recording={recording}
      controls={
        <label className="grid gap-1 text-xs text-subtle">
          Structure
          <select value={choice} onChange={(event) => setChoice(event.target.value as typeof choice)} className={FIELD}>
            {SHAPE_CHOICES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      }
    >
      {x ? (
        <div className="grid gap-3">
          <ArrayGrid label="x" snapshot={x} tone="input" />
          <dl className="grid grid-cols-2 gap-2 font-mono text-sm sm:grid-cols-4">
            <div><dt className="text-xs text-subtle">x.shape</dt><dd>{formatShape(x.shape)}</dd></div>
            <div><dt className="text-xs text-subtle">x.ndim</dt><dd>{x.shape.length}</dd></div>
            <div><dt className="text-xs text-subtle">x.size</dt><dd>{x.shape.reduce((p, n) => p * n, 1)}</dd></div>
            {x.shape.length === 2 ? (
              <div><dt className="text-xs text-subtle">rows × columns</dt><dd>{x.shape[0]} × {x.shape[1]}</dd></div>
            ) : null}
          </dl>
        </div>
      ) : null}
    </DemoFrame>
  );
}

/** A select of 0..count-1. */
function IndexSelect({
  label,
  value,
  count,
  start = 0,
  onChange,
}: {
  label: string;
  value: number;
  count: number;
  start?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-xs text-subtle">
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} className={FIELD}>
        {Array.from({ length: count }, (_, index) => index + start).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Lesson 04: choose an index or a slice; NumPy marks the cells it selects. */
export function IndexingDemo() {
  const [kind, setKind] = useState<Selection["kind"]>("element");
  const [row, setRow] = useState(1);
  const [col, setCol] = useState(2);
  const [rowStop, setRowStop] = useState(3);
  const [colStop, setColStop] = useState(4);
  const selection: Selection =
    kind === "element"
      ? { kind, row, col }
      : kind === "row"
        ? { kind, row }
        : kind === "column"
          ? { kind, col }
          : { kind, rowStart: row, rowStop: Math.max(rowStop, row + 1), colStart: col, colStop: Math.max(colStop, col + 1) };
  const code = indexingCode(selection);
  const recording = useDemoRecording(code);
  const frames = recording.state === "ready" ? recording.frames : [];
  const a = finalArray(frames, "a");
  const mask = finalArray(frames, "mask");
  const selected = finalArray(frames, "selected");
  const selectedRepr = frames[frames.length - 1]?.variables.find((item) => item.name === "selected")?.repr;

  return (
    <DemoFrame
      title="Choose an index or a slice"
      code={code}
      recording={recording}
      controls={
        <>
          <label className="grid gap-1 text-xs text-subtle">
            Select
            <select value={kind} onChange={(event) => setKind(event.target.value as Selection["kind"])} className={FIELD}>
              <option value="element">One element a[r, c]</option>
              <option value="row">A row a[r]</option>
              <option value="column">A column a[:, c]</option>
              <option value="slice">A slice a[r0:r1, c0:c1]</option>
            </select>
          </label>
          {kind !== "column" ? <IndexSelect label={kind === "slice" ? "r0" : "r"} value={row} count={INDEX_ROWS} onChange={setRow} /> : null}
          {kind === "slice" ? <IndexSelect label="r1" value={Math.max(rowStop, row + 1)} count={INDEX_ROWS - row} start={row + 1} onChange={setRowStop} /> : null}
          {kind !== "row" ? <IndexSelect label={kind === "slice" ? "c0" : "c"} value={col} count={INDEX_COLS} onChange={setCol} /> : null}
          {kind === "slice" ? <IndexSelect label="c1" value={Math.max(colStop, col + 1)} count={INDEX_COLS - col} start={col + 1} onChange={setColStop} /> : null}
        </>
      }
    >
      {a && mask ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <ArrayGrid label="a" snapshot={a} tone="input" highlight={(mask.values as number[]).flat(2) as number[]} />
          {selected ? (
            <ArrayGrid label="selected" snapshot={selected} tone="result" />
          ) : (
            <div className="rounded-card border border-tone-result bg-tone-result-soft p-3 text-sm">
              <p className="font-medium">selected</p>
              <p className="mt-2 font-mono text-lg">{selectedRepr}</p>
              <p className="mt-1 text-xs text-subtle">One element is a single number, not an array.</p>
            </div>
          )}
        </div>
      ) : null}
    </DemoFrame>
  );
}
