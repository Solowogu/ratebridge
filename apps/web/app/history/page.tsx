import Link from "next/link";
import { sql } from "../lib/db";

export const dynamic = "force-dynamic";

type Comparison = {
  id: string;
  amount: string;
  from_currency: string;
  to_currency: string;
  reference_rate: string;
  best_provider: string | null;
  best_recipient_amount: string | null;
  created_at: string;
};

export default async function HistoryPage() {
  const comparisons = (await sql`
    SELECT
      id,
      amount,
      from_currency,
      to_currency,
      reference_rate,
      best_provider,
      best_recipient_amount,
      created_at
    FROM comparisons
    ORDER BY created_at DESC
    LIMIT 50
  `) as Comparison[];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Comparison history
            </h1>

            <p className="mt-2 text-gray-600">
              Your 50 most recent RateBridge comparisons.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            New comparison
          </Link>
        </div>

        {comparisons.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              No comparisons have been saved yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
           <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                    Currency pair
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                    Reference rate
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                    Best provider
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                    Recipient amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisons.map((comparison) => (
                  <tr
                    key={comparison.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {new Date(comparison.created_at).toLocaleString()}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                      {Number(comparison.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {comparison.from_currency}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {comparison.from_currency} → {comparison.to_currency}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {Number(comparison.reference_rate).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 8,
                        }
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {comparison.best_provider ?? "Not available"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-green-700">
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
      </div>
    </main>
  );
}