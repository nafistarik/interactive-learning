import { useEffect, useState } from "react";

/**
 * Steps through `count` items one at a time, for views that walk result cells. Stops at the
 * last item. Paused or with reduced motion it stays where it is; `select` jumps to an item
 * (a click) and stops the walk there.
 *
 * @param count - Number of items.
 * @param running - Whether to advance (not paused, motion allowed).
 * @param intervalMs - Time per item.
 * @returns The current item and a function to select one.
 */
export function useCycle(count: number, running: boolean, intervalMs: number): [number, (index: number) => void] {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const atEnd = index >= count - 1;

  useEffect(() => {
    if (!running || held || atEnd) {
      return;
    }
    const timer = setTimeout(() => setIndex((value) => value + 1), intervalMs);
    return () => clearTimeout(timer);
  }, [running, held, atEnd, intervalMs, index]);

  return [
    Math.min(index, Math.max(count - 1, 0)),
    (next: number) => {
      setHeld(true);
      setIndex(next);
    },
  ];
}
