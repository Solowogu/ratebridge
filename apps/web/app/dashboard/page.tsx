import CreateAlertForm from "../components/CreateAlertForm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "../../auth";
import { sql } from "../lib/db";

type DashboardSummary = {
  active_alerts: string;
  comparison_count: string;
};

type RecentComparison = {
  id: string;
  amount: string;
  from_currency: string;
  to_currency: string;
  best_provider: string | null;
  best_recipient_amount: string | null;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const summaryResult = (await sql`
    SELECT
      (
        SELECT COUNT(*)
        FROM rate_alerts
        WHERE user_id = ${session.user.id}
          AND is_active = TRUE
      ) AS active_alerts,
      (
        SELECT COUNT(*)
        FROM comparisons
        WHERE user_id = ${session.user.id}
      ) AS comparison_count;
  `) as DashboardSummary[];

  const recentComparisons = (await sql`
    SELECT
      id,
      amount,
      from_currency,
      to_currency,
      best_provider,
      best_recipient_amount,
      created_at
    FROM comparisons
    WHERE user_id = ${session.user.id}
    ORDER BY created_at DESC
    LIMIT 5;
  `) as RecentComparison[];

  const activeAlerts = Number(
    summaryResult[0]?.active_alerts ?? 0
  );

  const comparisonCount = Number(
    summaryResult[0]?.comparison_count ?? 0
  );

  const firstName =
    session.user.name?.trim().split(/\s+/)[0] ?? "User";

  const latestPair = recentComparisons[0]
    ? `${recentComparisons[0].from_currency} → ${recentComparisons[0].to_currency}`
    : "No comparisons yet";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            RateBridge dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Welcome back, {firstName} 👋
          </h1>

          <p className="mt-3 text-gray-600">
            Review your alerts, comparison activity, and latest
            currency pair.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active alerts
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {activeAlerts}
            </p>

            <Link
              href="/alerts"
              className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              Manage alerts →
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Saved comparisons
            </p>

            <p className="mt-3 text-4xl font-bold text-green-600">
              {comparisonCount}
            </p>

            <Link
              href="/history"
              className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              View history →
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Latest currency pair
            </p>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {latestPair}
            </p>

            <Link
              href="/"
              className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              New comparison →
            </Link>
          </div>
       </section>

<section className="mt-10">
  <CreateAlertForm />
</section>

<section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent comparisons
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Your five most recent saved comparisons.
              </p>
            </div>

            <Link
              href="/history"
              className="rounded-xl border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View all
            </Link>
          </div>

          {recentComparisons.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
              <p className="text-gray-600">
                You have not saved any comparisons yet.
              </p>

              <Link
                href="/"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                Compare rates now
              </Link>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Pair
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Best provider
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Recipient receives
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentComparisons.map((comparison) => (
                    <tr
                      key={comparison.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {new Date(
                          comparison.created_at
                        ).toLocaleString()}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900">
                        {Number(comparison.amount).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        {comparison.from_currency}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                        {comparison.from_currency} →{" "}
                        {comparison.to_currency}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                        {comparison.best_provider ?? "Not available"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-green-700">
                        {comparison.best_recipient_amount
                          ? Number(
                              comparison.best_recipient_amount
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "Not available"}{" "}
                        {comparison.best_recipient_amount
                          ? comparison.to_currency
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick actions
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white hover:bg-blue-700"
            >
              New Comparison
            </Link>

            <Link
              href="/alerts"
              className="rounded-xl border border-gray-300 bg-white px-5 py-4 text-center font-semibold text-gray-800 hover:bg-gray-50"
            >
              Manage Alerts
            </Link>

            <Link
              href="/history"
              className="rounded-xl border border-gray-300 bg-white px-5 py-4 text-center font-semibold text-gray-800 hover:bg-gray-50"
            >
              View History
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}