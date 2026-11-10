import type { VariableSnapshot } from "@/features/execution/frames";

import { formatShape } from "./ArrayGrid";

/** Most values shown per array in the inspector, the rest are cut off. */
const INSPECTOR_VALUES = 8;

/**
 * Lists the variables of the current frame: name, type, shape, ndim, dtype and value. Large
 * arrays show their first values only.
 *
 * @param props.variables - The variables after the current statement.
 */
export function VariableInspector({ variables }: { variables: VariableSnapshot[] }) {
  if (variables.length === 0) {
    return <p className="text-sm text-subtle">No variables yet.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="text-subtle">
        <tr>
          <th className="whitespace-nowrap py-1 pr-4 font-medium">name</th>
          <th className="whitespace-nowrap py-1 pr-4 font-medium">type</th>
          <th className="whitespace-nowrap py-1 pr-4 font-medium">shape</th>
          <th className="whitespace-nowrap py-1 pr-4 font-medium">ndim</th>
          <th className="whitespace-nowrap py-1 pr-4 font-medium">dtype</th>
          <th className="whitespace-nowrap py-1 pr-4 font-medium">value</th>
        </tr>
      </thead>
      <tbody>
        {variables.map((variable) => {
          const array = variable.array;
          const values = array && Array.isArray(array.values) ? array.values : [];
          const shownValues = values.slice(0, INSPECTOR_VALUES);
          const cut = array ? array.truncated || values.length > INSPECTOR_VALUES : false;
          return (
            <tr key={variable.name} className="border-t border-line">
              <td className="whitespace-nowrap py-1 pr-4 font-mono">{variable.name}</td>
              <td className="whitespace-nowrap py-1 pr-4 font-mono">{variable.type}</td>
              <td className="whitespace-nowrap py-1 pr-4 font-mono">{array ? formatShape(array.shape) : "-"}</td>
              <td className="whitespace-nowrap py-1 pr-4 font-mono">{array ? array.shape.length : "-"}</td>
              <td className="whitespace-nowrap py-1 pr-4 font-mono">{array ? array.dtype : "-"}</td>
              <td className="whitespace-nowrap py-1 pr-4 font-mono">
                {array ? `[${shownValues.map(String).join(", ")}${cut ? ", …" : ""}]` : variable.repr}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
