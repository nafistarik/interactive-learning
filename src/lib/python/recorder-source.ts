/**
 * Python source of the frame recorder (brief Part 7). It runs once per Run all or first
 * Step: each top-level statement of the editor code executes once, in its own step, and
 * arithmetic is evaluated operand by operand so every operand is computed exactly once.
 * Kept as text so the browser and the Node tests run the same code.
 */
export const RECORDER_SOURCE = String.raw`
import ast
import io
import json
import math
import operator
import sys
import types

import numpy as np

MAX_VALUES = 64
MAX_REPR = 200
NOT_VISUALISED_NOTE = "Not visualised step by step: this statement runs as one step."

OPERATORS = {
    ast.Add: ("+", operator.add),
    ast.Sub: ("-", operator.sub),
    ast.Mult: ("*", operator.mul),
    ast.Div: ("/", operator.truediv),
}

COMPARATORS = {
    ast.Gt: (">", operator.gt),
    ast.GtE: (">=", operator.ge),
    ast.Lt: ("<", operator.lt),
    ast.LtE: ("<=", operator.le),
    ast.Eq: ("==", operator.eq),
    ast.NotEq: ("!=", operator.ne),
}

# Calls recorded as their own step (R2). Everything else is called normally, still once.
REDUCERS = ("sum", "mean", "max", "min", "std")
MATMULS = ("dot", "matmul")
RESHAPERS = ("reshape", "transpose")
RECORDED_CALLS = REDUCERS + MATMULS + RESHAPERS


class OperationFailed(Exception):
    """An arithmetic step failed. Carries the operand shapes, which the UI explains."""

    def __init__(self, cause, shapes):
        super().__init__(str(cause))
        self.cause = cause
        self.shapes = shapes


def json_value(value):
    """Makes a Python value JSON-safe: NaN and infinities become strings."""
    if isinstance(value, list):
        return [json_value(item) for item in value]
    if isinstance(value, (bool, int, str)):
        return value
    if isinstance(value, float):
        if math.isnan(value):
            return "NaN"
        if math.isinf(value):
            return "Infinity" if value > 0 else "-Infinity"
        return value
    return str(value)


def snapshot(value):
    """Shape, dtype and the first MAX_VALUES elements of an array-like value."""
    array = np.asarray(value)
    flat = array.ravel()
    return {
        "shape": list(array.shape),
        "dtype": str(array.dtype),
        "values": json_value(flat[:MAX_VALUES].tolist()),
        "truncated": bool(flat.size > MAX_VALUES),
    }


def variable_snapshot(name, value):
    """One namespace entry: arrays with their snapshot, everything else with its repr."""
    if isinstance(value, np.ndarray):
        return {"name": name, "type": "ndarray", "array": snapshot(value)}
    return {"name": name, "type": type(value).__name__, "repr": repr(value)[:MAX_REPR]}


def variables_of(namespace):
    """All user variables in the namespace. Modules, functions and classes are skipped."""
    result = []
    for name, value in namespace.items():
        if name.startswith("_"):
            continue
        if isinstance(value, (types.ModuleType, types.FunctionType, types.BuiltinFunctionType, type)):
            continue
        result.append(variable_snapshot(name, value))
    return result


def compile_statement(node):
    """Compiles one statement that keeps its original line numbers."""
    return compile(ast.Module(body=[node], type_ignores=[]), "<exec>", "exec")


def name_of(node):
    """The variable name of an operand, or None when the operand is not a plain name."""
    return node.id if isinstance(node, ast.Name) else None


def is_numpy(value):
    return isinstance(value, types.ModuleType) and value.__name__ == "numpy"


def simple_call(node):
    """A call like f.name(a, b, k=v) with no *args or **kwargs, so each part can run once."""
    return (
        isinstance(node, ast.Call)
        and isinstance(node.func, ast.Attribute)
        and not any(isinstance(arg, ast.Starred) for arg in node.args)
        and all(keyword.arg is not None for keyword in node.keywords)
    )


def attempt(step, compute, shapes, steps):
    """Runs one recorded operation. Appends the step with its result, or without it and raises."""
    try:
        result = compute()
    except Exception as failure:
        steps.append(step)
        raise OperationFailed(failure, shapes)
    step["result"] = snapshot(result)
    steps.append(step)
    return result


def binary(kind, symbol, function, left, right, left_node, right_node, steps):
    """A two-operand step: element-wise arithmetic, a comparison, or a matrix product."""
    left_snapshot = snapshot(left)
    right_snapshot = snapshot(right)
    step = {
        "kind": kind,
        "left": left_snapshot,
        "right": right_snapshot,
        "leftName": name_of(left_node),
        "rightName": name_of(right_node),
    }
    if kind == "binary":
        step["operator"] = symbol
    shapes = [left_snapshot["shape"], right_snapshot["shape"]]
    return attempt(step, lambda: function(left, right), shapes, steps)


def axis_of(value):
    """An axis argument the view can draw: None or one int. Other forms are not recorded."""
    if value is None or (isinstance(value, (int, np.integer)) and not isinstance(value, bool)):
        return True, (None if value is None else int(value))
    return False, None


def requested_shape(rest):
    """The shape asked for in reshape(…): reshape(2, 3) or reshape((2, 3)); None if unclear."""
    values = rest[0] if len(rest) == 1 and isinstance(rest[0], (tuple, list)) else rest
    if len(rest) == 1 and isinstance(rest[0], (int, np.integer)):
        values = [rest[0]]
    try:
        return [int(size) for size in values]
    except (TypeError, ValueError):
        return None


def recorded_call(node, namespace, steps):
    """Evaluates np.f(a, …) or a.f(…) for the recorded calls, each part exactly once."""
    owner = evaluate(node.func.value, namespace, steps)
    name = node.func.attr
    args = [evaluate(arg, namespace, steps) for arg in node.args]
    kwargs = {keyword.arg: evaluate(keyword.value, namespace, steps) for keyword in node.keywords}

    if is_numpy(owner) and args:
        subject, rest, subject_node, rest_nodes = args[0], args[1:], node.args[0], node.args[1:]
        function = getattr(np, name)
        call = lambda: function(subject, *rest, **kwargs)
    elif isinstance(owner, np.ndarray):
        subject, rest, subject_node, rest_nodes = owner, args, node.func.value, node.args
        call = lambda: getattr(owner, name)(*rest, **kwargs)
    else:
        return getattr(owner, name)(*args, **kwargs)

    if name in MATMULS and len(rest) == 1 and not kwargs:
        return binary("matmul", "@", lambda left, right: call(), subject, rest[0], subject_node, rest_nodes[0], steps)

    input_snapshot = snapshot(subject)
    if name in REDUCERS:
        axis_value = kwargs.get("axis", rest[0] if rest else None)
        drawable, axis = axis_of(axis_value)
        if not drawable:
            return call()
        step = {
            "kind": "reduce",
            "fn": name,
            "input": input_snapshot,
            "inputName": name_of(subject_node),
            "axis": axis,
            "keepdims": bool(kwargs.get("keepdims", False)),
        }
        return attempt(step, call, [input_snapshot["shape"]], steps)

    if name == "reshape" and not rest:
        return call()
    step = {
        "kind": "reshape",
        "fn": name,
        "input": input_snapshot,
        "inputName": name_of(subject_node),
        "requested": requested_shape(rest) if name == "reshape" else None,
    }
    return attempt(step, call, [input_snapshot["shape"]], steps)


def evaluate(node, namespace, steps):
    """Evaluates an expression once. Each recorded operation appends one step, operands first."""
    if isinstance(node, ast.BinOp) and type(node.op) in OPERATORS:
        symbol, function = OPERATORS[type(node.op)]
        left = evaluate(node.left, namespace, steps)
        right = evaluate(node.right, namespace, steps)
        return binary("binary", symbol, function, left, right, node.left, node.right, steps)
    if isinstance(node, ast.BinOp) and isinstance(node.op, ast.MatMult):
        left = evaluate(node.left, namespace, steps)
        right = evaluate(node.right, namespace, steps)
        return binary("matmul", "@", operator.matmul, left, right, node.left, node.right, steps)
    if isinstance(node, ast.Compare) and len(node.ops) == 1 and type(node.ops[0]) in COMPARATORS:
        symbol, function = COMPARATORS[type(node.ops[0])]
        left = evaluate(node.left, namespace, steps)
        right = evaluate(node.comparators[0], namespace, steps)
        return binary("binary", symbol, function, left, right, node.left, node.comparators[0], steps)
    if isinstance(node, ast.Attribute) and node.attr == "T":
        base = evaluate(node.value, namespace, steps)
        if not isinstance(base, np.ndarray):
            return base.T
        input_snapshot = snapshot(base)
        step = {
            "kind": "reshape",
            "fn": "transpose",
            "input": input_snapshot,
            "inputName": name_of(node.value),
            "requested": None,
        }
        return attempt(step, lambda: base.T, [input_snapshot["shape"]], steps)
    if simple_call(node) and node.func.attr in RECORDED_CALLS:
        return recorded_call(node, namespace, steps)
    return eval(compile(ast.Expression(body=node), "<exec>", "eval"), namespace)


def run_statement(statement, namespace, steps):
    """Runs one top-level statement. Returns (target name, result snapshot) for the frame."""
    if isinstance(statement, ast.Expr):
        value = evaluate(statement.value, namespace, steps)
        result = variable_snapshot("result", value) if value is not None else None
        return None, result
    if isinstance(statement, ast.Assign):
        value = evaluate(statement.value, namespace, steps)
        namespace["__value__"] = value
        try:
            assign = ast.Assign(
                targets=statement.targets,
                value=ast.Name(id="__value__", ctx=ast.Load()),
            )
            ast.copy_location(assign, statement)
            ast.fix_missing_locations(assign)
            exec(compile_statement(assign), namespace)
        finally:
            namespace.pop("__value__", None)
        single = len(statement.targets) == 1 and isinstance(statement.targets[0], ast.Name)
        return (statement.targets[0].id if single else None), None
    exec(compile_statement(statement), namespace)
    return None, None


def static_kind(statement):
    """Operation type of a statement before it runs; arithmetic can change it afterwards."""
    if isinstance(statement, (ast.Import, ast.ImportFrom)):
        return "import"
    if isinstance(statement, ast.Assign):
        return "assign"
    if isinstance(statement, ast.Expr):
        return "expression"
    return "not-visualised"


def record_editor(tree, code, namespace):
    """Runs each top-level statement once and returns one frame per statement."""
    lines = code.split("\n")
    frames = []
    for statement in tree.body:
        steps = []
        buffer = io.StringIO()
        previous = sys.stdout
        sys.stdout = buffer
        error = None
        target = None
        result = None
        try:
            target, result = run_statement(statement, namespace, steps)
        except OperationFailed as failure:
            error = {
                "type": type(failure.cause).__name__,
                "message": str(failure.cause),
                "operandShapes": failure.shapes,
            }
        except Exception as failure:
            error = {"type": type(failure).__name__, "message": str(failure)}
        finally:
            sys.stdout = previous

        kind = static_kind(statement)
        if steps and kind in ("assign", "expression"):
            kind = "binary-op" if all(step["kind"] == "binary" for step in steps) else "operation"

        frame = {
            "index": len(frames),
            "startLine": statement.lineno,
            "endLine": statement.end_lineno,
            "source": "\n".join(lines[statement.lineno - 1:statement.end_lineno]),
            "operationType": kind,
            "operations": steps,
            "variables": variables_of(namespace),
            "stdout": buffer.getvalue(),
            "status": "error" if error is not None else "success",
        }
        if target is not None:
            frame["targetName"] = target
        if result is not None:
            frame["result"] = result
        if kind == "not-visualised":
            frame["note"] = NOT_VISUALISED_NOTE
        if error is not None:
            frame["error"] = error
        frames.append(frame)
        if error is not None:
            break
    return frames


def syntax_frame(failure, code):
    """The single frame for code that does not parse."""
    lines = code.split("\n")
    line = failure.lineno or 1
    source = lines[line - 1] if 0 < line <= len(lines) else ""
    return {
        "index": 0,
        "startLine": line,
        "endLine": line,
        "source": source,
        "operationType": "not-visualised",
        "operations": [],
        "variables": [],
        "stdout": "",
        "status": "error",
        "error": {"type": "SyntaxError", "message": failure.msg},
    }


def record_frames(code, prelude=""):
    """Entry point. Runs the prelude in a fresh namespace, then records the editor code.

    Returns JSON: {"frames": [...], "fatal": null} or {"frames": [], "fatal": "..."} when
    the prelude fails.
    """
    namespace = {"__name__": "__main__"}
    try:
        exec(compile(prelude, "<prelude>", "exec"), namespace)
    except Exception as failure:
        message = "The exercise setup failed: " + type(failure).__name__ + ": " + str(failure)
        return json.dumps({"frames": [], "fatal": message})
    try:
        tree = ast.parse(code, filename="<exec>")
    except SyntaxError as failure:
        return json.dumps({"frames": [syntax_frame(failure, code)], "fatal": None})
    return json.dumps({"frames": record_editor(tree, code, namespace), "fatal": None})
`;
