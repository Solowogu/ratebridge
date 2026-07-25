import Link from "next/link";
import { sql } from "../lib/db";
import { providers } from "../data/providers";

type AlertSummary = {
  count: string;
};

type PopularPair = {
  from_currency: string;
  to_currency: string;
  total: string;
};

type BestProviderSummary = {
  best_provider: string | null;
  total: string;
};

export default async function Dashboard() {
  const alertResult = (await sql`
    SELECT COUNT(*) AS count
    FROM rate_alerts
    WHERE is_active = TRUE
  `) as AlertSummary[];

  const popularPairResult = (await sql`
    SELECT
      from_currency,
      to_currency,
      COUNT(*) AS total
    FROM comparisons
    GROUP BY from_currency, to_currency
    ORDER BY total DESC
    LIMIT 1
  `) as PopularPair[];

  const bestProviderResult = (await sql`
    SELECT
      best_provider,
      COUNT(*) AS total
    FROM comparisons
    WHERE best_provider IS NOT NULL
    GROUP BY best_provider
    ORDER BY total DESC
    LIMIT 1
  `) as BestProviderSummary[];

  const activeAlerts = Number(alertResult[0]?.count ?? 0);

  const popularPair = popularPairResult[0];

  const bestProvider =
    bestProviderResult[0]?.best_provider ?? "Not available";

  return (
    <section className="mx-auto mt-10 max-w-6xl px-6">
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Active Alerts
          </p>

          <p className="mt-2 text-4xl font-bold text-blue-600">
            {activeAlerts}
          </p>

          <Link
            href="/alerts"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            View alerts →
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Best Provider
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {bestProvider}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Most frequently ranked first
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Popular Pair
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {popularPair
              ? `${popularPair.from_currency} → ${popularPair.to_currency}`
              : "Not available"}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Most compared currency pair
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Providers
          </p>

          <p className="mt-2 text-4xl font-bold text-green-600">
            {providers.length}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Available for comparison
          </p>
        </div>
      </div>
    </section>
  );
}