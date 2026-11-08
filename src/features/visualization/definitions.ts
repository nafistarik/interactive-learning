import type { ExecutionFrame } from "@/features/execution/frames";

/** The frame that last assigned one operand's variable before a given frame. */
export interface OperandDefinition {
  name: string;
  frame: ExecutionFrame;
}

/**
 * Finds, for each named operand, the most recent frame before `before` that assigned it. A
 * failed broadcast points the learner at these lines: the one that defined the wrong shape is
 * the one to fix (brief Part 9, step 4).
 *
 * @param frames - All recorded frames.
 * @param before - The index of the failing frame; only earlier frames are searched.
 * @param names - The operand names of the failing step; `null` names are skipped.
 * @returns One definition per name that was assigned by a successful frame.
 */
export function findOperandDefinitions(
  frames: ExecutionFrame[],
  before: number,
  names: (string | null)[],
): OperandDefinition[] {
  const definitions: OperandDefinition[] = [];
  for (const name of names) {
    if (name === null || definitions.some((definition) => definition.name === name)) {
      continue;
    }
    const frame = frames
      .slice(0, before)
      .reverse()
      .find((candidate) => candidate.targetName === name && candidate.status === "success");
    if (frame) {
      definitions.push({ name, frame });
    }
  }
  return definitions;
}
