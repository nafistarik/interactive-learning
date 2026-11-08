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


def evaluate(node, namespace, steps):
    """Evaluates an expression once. Each arithmetic node appends one step, operands first."""
    if isinstance(node, ast.BinOp) and type(node.op) in OPERATORS:
        symbol, function = OPERATORS[type(node.op)]
        left = evaluate(node.left, namespace, steps)
        right = evaluate(node.right, namespace, steps)
        left_snapshot = snapshot(left)
        right_snapshot = snapshot(right)
        try:
            result = function(left, right)
        except Exception as failure:
            steps.append({
                "operator": symbol,
                "left": left_snapshot,
                "right": right_snapshot,
                "leftName": name_of(node.left),
                "rightName": name_of(node.right),
            })
            raise OperationFailed(failure, [left_snapshot["shape"], right_snapshot["shape"]])
        steps.append({
            "operator": symbol,
            "left": left_snapshot,
            "right": right_snapshot,
            "leftName": name_of(node.left),
            "rightName": name_of(node.right),
            "result": snapshot(result),
        })
        return result
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
            kind = "binary-op"

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
