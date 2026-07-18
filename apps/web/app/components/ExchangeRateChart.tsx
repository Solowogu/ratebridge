"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { day: "Mon", rate: 992 },
  { day: "Tue", rate: 995 },
  { day: "Wed", rate: 998 },
  { day: "Thu", rate: 996 },
  { day: "Fri", rate: 1001 },
  { day: "Sat", rate: 1004 },
  { day: "Sun", rate: 999 },
];

export default function ExchangeRateChart() {
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Exchange Rate Trend
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        Sample 7-day exchange rate history.
      </p>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="rate"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}