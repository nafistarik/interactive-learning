"use client";

import type { OperationStep } from "@/features/execution/frames";
import type { AnimationStage } from "@/features/visualization/broadcast";

import { BroadcastView } from "./BroadcastView";
import { MatmulView } from "./MatmulView";
import { ReduceView } from "./ReduceView";
import { ReshapeView } from "./ReshapeView";
import { UfuncView } from "./UfuncView";

/**
 * Picks the view for a recorded step by its kind (R2 brief: visualization registry).
 *
 * @param props.step - The recorded step.
 * @param props.phase - The stage to show.
 * @param props.failureMessage - NumPy's error when the step failed, else `null`.
 * @param props.playing - Whether views may animate inside a stage (not paused, motion allowed).
 * @param props.speed - Playback speed.
 */
export function OperationView({
  step,
  phase,
  failureMessage,
  playing,
  speed,
}: {
  step: OperationStep;
  phase: Exclude<AnimationStage["phase"], "show">;
  failureMessage: string | null;
  playing: boolean;
  speed: number;
}) {
  const common = { failureMessage, playing, speed };
  switch (step.kind) {
    case "binary":
      return <BroadcastView step={step} phase={phase} failureMessage={failureMessage} />;
    case "matmul":
      return <MatmulView step={step} phase={phase} {...common} />;
    case "reduce":
      return <ReduceView step={step} phase={phase} {...common} />;
    case "reshape":
      return <ReshapeView step={step} phase={phase === "align" ? "result" : phase} {...common} />;
    case "ufunc":
      return <UfuncView step={step} phase={phase === "align" ? "result" : phase} {...common} />;
  }
}
