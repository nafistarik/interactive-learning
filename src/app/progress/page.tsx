import Link from "next/link";

import { ProgressView } from "@/components/progress/ProgressView";

/**
 * Progress page (`/progress`), brief Part 4.4. The numbers come from the saved progress in this
 * browser; the view reads them after the page loads.
 */
export default function ProgressPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <nav className="text-sm text-subtle">
        <Link href="/" className="underline">
          Dashboard
        </Link>{" "}
        / Progress
      </nav>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Progress</h1>
      <ProgressView />
    </main>
  );
}
