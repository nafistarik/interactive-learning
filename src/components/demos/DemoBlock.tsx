"use client";

import type { DemoId } from "@/features/content/types";

import { DimensionsDemo, EditArrayDemo, IndexingDemo, ShapePickerDemo } from "./ArrayDemos";
import { BroadcastShapesDemo, ElementwiseDemo, VectorizationTimingDemo, XwbStepsDemo } from "./OperationDemos";

/** The component for each demo id used in the lesson data. */
const DEMOS: Record<DemoId, () => React.JSX.Element> = {
  "edit-array": EditArrayDemo,
  dimensions: DimensionsDemo,
  "shape-picker": ShapePickerDemo,
  indexing: IndexingDemo,
  "vectorization-timing": VectorizationTimingDemo,
  elementwise: ElementwiseDemo,
  "broadcast-shapes": BroadcastShapesDemo,
  "xwb-steps": XwbStepsDemo,
};

/**
 * Renders the demo a lesson block names.
 *
 * @param props.demo - The demo id.
 */
export function DemoBlock({ demo }: { demo: DemoId }) {
  const Demo = DEMOS[demo];
  return <Demo />;
}
