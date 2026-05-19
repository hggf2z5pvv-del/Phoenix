import Link from "next/link";

import { signup } from "./actions";

type SignupPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-slate-950 dark:text-white";

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error, success } = await searchParams;
  const isSuccess = success === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 px-4 py-12 font-sans text-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 dark:text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/50 bg-white/85 p-8 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
            Phoenix Claims
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign up</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Create your Phoenix Claims account
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

        {isSuccess ? (
          <div className="mb-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
            Check your email to confirm your account before logging in.
          </div>
        ) : (
          <form action={signup} className="space-y-4">
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
                autoComplete="new-password"
                required
                minLength={6}
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className={inputClassName}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Sign up
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-700 hover:underline dark:text-blue-300"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
