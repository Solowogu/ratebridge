import Link from "next/link";
import { sql } from "../lib/db";
import AlertStatusButton from "./AlertStatusButton";
import EditAlertButton from "./EditAlertButton";
import DeleteAlertButton from "./DeleteAlertButton";

type RateAlert = {
  id: string;
  email: string;
  from_currency: string;
  to_currency: string;
  target_rate: string;
  current_rate: string;
  is_active: boolean;
  created_at: string;
};

export default async function AlertsPage() {
  const alerts = (await sql`
    SELECT *
    FROM rate_alerts
    ORDER BY created_at DESC
  `) as RateAlert[];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Rate Alerts
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your saved exchange rate alerts.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back Home
          </Link>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow">
            No alerts have been created yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Pair</th>
                  <th className="px-5 py-4">Target</th>
                  <th className="px-5 py-4">Current</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="border-t"
                  >
                    <td className="px-5 py-4">
                      {alert.email}
                    </td>

                    <td className="px-5 py-4">
                      {alert.from_currency} → {alert.to_currency}
                    </td>

                    <td className="px-5 py-4">
                      {Number(alert.target_rate).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      {Number(alert.current_rate).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      {alert.is_active ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-200 px-3 py-1">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
  <div className="flex flex-wrap gap-2">
    <AlertStatusButton
      alertId={alert.id}
      isActive={alert.is_active}
    />

    <EditAlertButton
      alertId={alert.id}
      initialEmail={alert.email}
      initialTargetRate={alert.target_rate}
    />

    <DeleteAlertButton
      alertId={alert.id}
    />
  </div>
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