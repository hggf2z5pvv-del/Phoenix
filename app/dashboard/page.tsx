import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type MembershipWithOrganization = {
  organizations: {
    name: string;
  } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("organizations(name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle<MembershipWithOrganization>();

  const organizationName =
    membership?.organizations?.name ?? "Your organization";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 px-4 py-12 font-sans text-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 dark:text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/50 bg-white/85 p-8 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
          Phoenix Claims
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Welcome, {user.email}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Organization:{" "}
          <span className="font-medium text-slate-900 dark:text-white">
            {organizationName}
          </span>
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/claims"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            View claims
          </Link>

          <form action="/logout" method="post">
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10 sm:w-auto"
            >
              Log out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
