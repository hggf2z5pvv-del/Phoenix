import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 px-4 py-12 font-sans text-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 dark:text-white">
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
          Insurance claims, simplified
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
          Phoenix Claims
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-slate-700 dark:text-slate-300">
          Multi-tenant claims management for modern insurance teams.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-full border border-slate-900/15 bg-white/70 px-6 text-sm font-semibold text-slate-900 backdrop-blur transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
}
