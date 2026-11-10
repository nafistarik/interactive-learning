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
    return <p className="text-sm text-subtle">Run the code to see its steps here.</p>;
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
                isCurrent ? "bg-accent-soft text-fg" : "hover:bg-surface-2"
              }`}
            >
              <span className="w-6 text-subtle">{frame.index + 1}</span>
              <span className="w-24 text-xs text-subtle">
                lines {frame.startLine}
                {frame.endLine !== frame.startLine ? `–${frame.endLine}` : ""}
              </span>
              <span className="flex-1 truncate font-mono">{frame.source.split("\n")[0]}</span>
              <span className={frame.status === "error" ? "text-danger" : "text-subtle"}>
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
