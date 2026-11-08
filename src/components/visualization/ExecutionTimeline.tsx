import type { ExecutionFrame } from "@/features/execution/frames";

/**
 * Every recorded frame as a row. The current one is marked; a completed one shows as done,
 * the failing one as an error. Clicking a row jumps to that frame (brief Part 8).
 *
 * @param props.frames - The recorded frames.
 * @param props.current - Index of the frame on screen.
 * @param props.onSelect - Called with the index of the clicked frame.
 */
export function ExecutionTimeline({
  frames,
  current,
  onSelect,
}: {
  frames: ExecutionFrame[];
  current: number;
  onSelect: (index: number) => void;
}) {
  if (frames.length === 0) {
    return <p className="text-sm text-zinc-500">Run the code to see its steps here.</p>;
  }

  return (
    <ol className="grid gap-1">
      {frames.map((frame) => {
        const isCurrent = frame.index === current;
        const label = frame.status === "error" ? "error" : frame.index < current ? "done" : isCurrent ? "current" : "not reached";
        return (
          <li key={frame.index}>
            <button
              type="button"
              onClick={() => onSelect(frame.index)}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex w-full items-baseline gap-3 rounded-md px-3 py-1.5 text-left text-sm ${
                isCurrent ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <span className="w-6 text-zinc-500">{frame.index + 1}</span>
              <span className="w-24 text-xs text-zinc-500">
                lines {frame.startLine}
                {frame.endLine !== frame.startLine ? `–${frame.endLine}` : ""}
              </span>
              <span className="flex-1 truncate font-mono">{frame.source.split("\n")[0]}</span>
              <span className={frame.status === "error" ? "text-red-600 dark:text-red-400" : "text-zinc-500"}>
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
