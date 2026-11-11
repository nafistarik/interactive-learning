/**
 * Python source of the module's `Value` class, in pieces that lessons and exercises combine.
 * It follows the R5 graph convention: `data`, `grad`, `_prev`, `_op`, `label`, `_backward`.
 */

/** The constructor: a number, its gradient, its inputs and the operation that made it. */
export const VALUE_INIT = [
  "class Value:",
  '    def __init__(self, data, _prev=(), _op="", label=""):',
  "        self.data = data",
  "        self.grad = 0.0",
  "        self._prev = _prev",
  "        self._op = _op",
  "        self.label = label",
  "        self._backward = lambda: None",
].join("\n");

/** `a + b`: the local gradient is 1 for both inputs. */
export const VALUE_ADD = [
  "    def __add__(self, other):",
  '        out = Value(self.data + other.data, (self, other), "+")',
  "        def _backward():",
  "            self.grad += out.grad",
  "            other.grad += out.grad",
  "        out._backward = _backward",
  "        return out",
].join("\n");

/** `a * b`: the local gradient of each input is the other input's data. */
export const VALUE_MUL = [
  "    def __mul__(self, other):",
  '        out = Value(self.data * other.data, (self, other), "*")',
  "        def _backward():",
  "            self.grad += other.data * out.grad",
  "            other.grad += self.data * out.grad",
  "        out._backward = _backward",
  "        return out",
].join("\n");

/** `tanh`: one input, local gradient `1 - t * t`. Needs `import math`. */
export const VALUE_TANH = [
  "    def tanh(self):",
  "        t = math.tanh(self.data)",
  '        out = Value(t, (self,), "tanh")',
  "        def _backward():",
  "            self.grad += (1 - t * t) * out.grad",
  "        out._backward = _backward",
  "        return out",
].join("\n");

/** `backward()`: topological order by depth-first search, then `_backward` in reverse. */
export const VALUE_BACKWARD = [
  "    def backward(self):",
  "        order = []",
  "        seen = set()",
  "        def build(v):",
  "            if v not in seen:",
  "                seen.add(v)",
  "                for child in v._prev:",
  "                    build(child)",
  "                order.append(v)",
  "        build(self)",
  "        self.grad = 1.0",
  "        for v in reversed(order):",
  "            v._backward()",
].join("\n");

/** The class with the given methods, one blank line between them. */
export const valueClass = (...methods: string[]) => [VALUE_INIT, ...methods].join("\n\n");
