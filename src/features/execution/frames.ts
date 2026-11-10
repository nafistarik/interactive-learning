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

/** Operators of a `binary` step: element-wise arithmetic and comparisons. */
export type BinaryOperator = "+" | "-" | "*" | "/" | ">" | ">=" | "<" | "<=" | "==" | "!=";

/** Operand names, shared by the two-operand steps. `null` when an operand is not a plain name. */
interface TwoOperands {
  left: ArraySnapshot;
  right: ArraySnapshot;
  leftName: string | null;
  rightName: string | null;
  /** Absent when the operation failed. */
  result?: ArraySnapshot;
}

/** Element-wise arithmetic or a comparison, with broadcasting. */
export interface BinaryStep extends TwoOperands {
  kind: "binary";
  operator: BinaryOperator;
}

/** A matrix product: `a @ b`, `np.dot`, `np.matmul`, `a.dot(b)`. */
export interface MatmulStep extends TwoOperands {
  kind: "matmul";
}

/** One input, as recorded for reductions and reshapes. */
interface OneOperand {
  input: ArraySnapshot;
  inputName: string | null;
  /** Absent when the operation failed. */
  result?: ArraySnapshot;
}

/** A reduction along one axis, or over the whole array when `axis` is `null`. */
export interface ReduceStep extends OneOperand {
  kind: "reduce";
  fn: "sum" | "mean" | "max" | "min" | "std";
  axis: number | null;
  keepdims: boolean;
}

/** A reshape (with the requested shape, when it could be read) or a transpose. */
export interface ReshapeStep extends OneOperand {
  kind: "reshape";
  fn: "reshape" | "transpose";
  requested: number[] | null;
}

/** An element-wise NumPy function of one array, e.g. `np.exp(z)`. */
export interface UfuncStep extends OneOperand {
  kind: "ufunc";
  fn: "exp" | "log" | "sqrt" | "abs" | "square" | "tanh" | "sign";
}

/** One recorded sub-step of a statement, in evaluation order. */
export type OperationStep = BinaryStep | MatmulStep | ReduceStep | ReshapeStep | UfuncStep;

/** A watched value after one loop iteration: a number (NaN/infinity as strings) or an array. */
export type WatchedValue = { number: number | string } | { array: ArraySnapshot };

/** The watched values after one iteration. */
export interface IterationSnapshot {
  iteration: number;
  values: Record<string, WatchedValue>;
}

/**
 * A top-level loop's iterations (R3). At most 300 are kept; a longer loop keeps an even
 * sample (`sampled`) and always its last iteration. `total` is how many ran.
 */
export interface LoopRecord {
  watched: string[];
  iterations: IterationSnapshot[];
  total: number;
  sampled: boolean;
}

/**
 * The operand variable names of a step, for pointing at the line to fix when it fails.
 *
 * @param step - The step.
 * @returns The names (`null` for operands that are not plain names).
 */
export function operandNames(step: OperationStep): (string | null)[] {
  return step.kind === "binary" || step.kind === "matmul" ? [step.leftName, step.rightName] : [step.inputName];
}

/** Kind of statement a frame records. */
/** `binary-op`: only element-wise steps; `operation`: at least one other recorded step. */
export type OperationType = "import" | "assign" | "expression" | "binary-op" | "operation" | "loop" | "not-visualised";

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
  /** The loop's iterations, for `operationType: "loop"`. */
  loop?: LoopRecord;
  /** Why a statement is not visualised step by step. */
  note?: string;
}

/** Result of recording a whole run. `ok: false` means nothing ran (setup or runtime failed). */
export type RecordingOutcome =
  | { ok: true; frames: ExecutionFrame[] }
  | { ok: false; frames: []; error: string };
