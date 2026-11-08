/**
 * Execution frame types (brief Part 13). The Python recorder produces them and the
 * visualization reads them; neither side holds its own copy of example values.
 */

/** A value inside an array snapshot, or a plain Python value. */
export type Values = number | string | boolean | Values[];

/**
 * One array at one moment. `values` is the flattened first 64 elements (row-major), with
 * `truncated` set when the array has more. NaN and infinities are sent as strings.
 */
export interface ArraySnapshot {
  shape: number[];
  dtype: string;
  values: Values;
  truncated: boolean;
}

/** One variable in the namespace after a statement. Arrays carry `array`, others `repr`. */
export interface VariableSnapshot {
  name: string;
  type: string;
  array?: ArraySnapshot;
  repr?: string;
}

/** One arithmetic sub-step. `result` is absent when the operation failed. */
export interface OperationStep {
  operator: "+" | "-" | "*" | "/";
  left: ArraySnapshot;
  right: ArraySnapshot;
  /** Variable name of the left operand, or `null` when it is not a plain name. */
  leftName: string | null;
  /** Variable name of the right operand, or `null` when it is not a plain name. */
  rightName: string | null;
  result?: ArraySnapshot;
}

/** Kind of statement a frame records. */
export type OperationType = "import" | "assign" | "expression" | "binary-op" | "not-visualised";

/** One top-level statement of the editor code, after it ran. */
export interface ExecutionFrame {
  index: number;
  startLine: number;
  endLine: number;
  source: string;
  operationType: OperationType;
  targetName?: string;
  operations: OperationStep[];
  variables: VariableSnapshot[];
  stdout: string;
  status: "success" | "error";
  error?: {
    type: string;
    message: string;
    operandShapes?: number[][];
  };
  /** Value of a bare expression, shown like a REPL result. */
  result?: VariableSnapshot;
  /** Why a statement is not visualised step by step. */
  note?: string;
}

/** Result of recording a whole run. `ok: false` means nothing ran (setup or runtime failed). */
export type RecordingOutcome =
  | { ok: true; frames: ExecutionFrame[] }
  | { ok: false; frames: []; error: string };
