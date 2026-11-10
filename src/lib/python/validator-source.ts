/**
 * Python source of the exercise validator (brief Part 10). It runs the learner's code once per
 * run (the visible setup, then any hidden setup), then compares the named values with the
 * expressions evaluated on a separate reference. The comparison uses the real values, never the
 * learner's source text.
 */
export const VALIDATOR_SOURCE = String.raw`
import ast
import json

import numpy as np

LOOP_NODES = (ast.For, ast.While, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)
NO_LOOP_PROBLEM = "Solve it without a Python loop: use one NumPy operation on the whole array."


def has_loop(code):
    """True when the code has a for/while loop or a comprehension. Unparsable code is not a loop."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return False
    return any(isinstance(node, LOOP_NODES) for node in ast.walk(tree))


def same_value(actual, expected):
    """True when two values have the same shape and numerically equal elements."""
    actual_array = np.asarray(actual)
    expected_array = np.asarray(expected)
    if actual_array.shape != expected_array.shape:
        return False
    try:
        return bool(np.allclose(actual_array, expected_array))
    except TypeError:
        return bool(np.array_equal(actual_array, expected_array))


def compare(check, namespace, expected):
    """One problem message for a failed check, or None when the check passes."""
    name = check["name"]
    if name not in namespace:
        return name + " is missing. Create a variable named " + name + "."
    actual = namespace[name]
    if check["kind"] == "unchanged":
        if same_value(actual, expected):
            return None
        return name + " must keep its starter value."
    actual_shape = np.asarray(actual).shape
    expected_shape = np.asarray(expected).shape
    if actual_shape != expected_shape:
        return name + " has shape " + str(actual_shape) + ", expected " + str(expected_shape) + "."
    if not same_value(actual, expected):
        return name + " has the wrong values."
    return None


def validate_exercise(code, runs_json, checks_json):
    """Returns JSON {"passed": bool, "problems": [...]} for the learner's code."""
    runs = json.loads(runs_json)
    all_checks = json.loads(checks_json)
    problems = []
    if any(check["kind"] == "no-loop" for check in all_checks) and has_loop(code):
        problems.append(NO_LOOP_PROBLEM)
    checks = [check for check in all_checks if check["kind"] != "no-loop"]

    for run in runs:
        reference = {"__name__": "__main__"}
        exec(compile(run["reference"], "<reference>", "exec"), reference)
        expected = [eval(check["expression"], reference) for check in checks]

        namespace = {"__name__": "__main__"}
        try:
            exec(compile(run["prelude"], "<prelude>", "exec"), namespace)
            exec(compile(code, "<exec>", "exec"), namespace)
        except Exception as failure:
            problems.append("The code stopped with " + type(failure).__name__ + ": " + str(failure))
            continue

        for check, expected_value in zip(checks, expected):
            problem = compare(check, namespace, expected_value)
            if problem is not None and problem not in problems:
                problems.append(problem)

    return json.dumps({"passed": len(problems) == 0, "problems": problems})
`;
