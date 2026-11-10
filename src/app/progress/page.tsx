import { ProgressView } from "@/components/progress/ProgressView";

/**
 * Progress page (`/progress`), brief Part 4.4. The numbers come from the saved progress in this
 * browser; the view reads them after the page loads.
 */
export default function ProgressPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Your progress</h1>
      <p className="mt-1 text-muted">Saved in this browser only. Nothing is sent anywhere.</p>
      <ProgressView />
    </main>
  );
}
