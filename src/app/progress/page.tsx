import Link from "next/link";

/**
 * Progress page (`/progress`), brief Part 4.4. XP, stars and progress tracking come with
 * milestone 2, so this page says so instead of showing numbers.
 */
export default function ProgressPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Progress tracking is not built yet.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Back to dashboard
      </Link>
    </main>
  );
}
