import Link from "next/link";

import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-slate-950 dark:text-white";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 px-4 py-12 font-sans text-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 dark:text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/50 bg-white/85 p-8 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
            Phoenix Claims
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Log in</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Access your Phoenix Claims workspace
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-900 dark:bg-red-950/50 dark:text-red-100"
          >
            {error}
          </div>
        ) : null}

        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClassName}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-700 hover:underline dark:text-blue-300"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
