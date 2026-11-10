import Link from "next/link";

/** 404 page for unknown URLs and for `notFound()` calls, brief Part 4. */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-start justify-center px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">
        This page does not exist. Lessons are numbered 01 to 08.
      </p>
      <Link href="/" className="btn mt-6">
        Back to dashboard
      </Link>
    </main>
  );
}
