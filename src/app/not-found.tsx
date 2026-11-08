import Link from "next/link";

/** 404 page for unknown URLs and for `notFound()` calls, brief Part 4. */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        This page does not exist.
      </p>
      <Link href="/" className="mt-6 text-sm underline">
        Back to dashboard
      </Link>
    </main>
  );
}
