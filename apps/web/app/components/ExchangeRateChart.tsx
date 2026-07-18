"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ExchangeRateChartProps = {
  fromCurrency: string;
  toCurrency: string;
};

type HistoricalRatePoint = {
  date: string;
  rate: number;
};

type HistoricalRateResponse = {
  from?: string;
  to?: string;
  data?: HistoricalRatePoint[];
  error?: string;
};

export default function ExchangeRateChart({
  fromCurrency,
  toCurrency,
}: ExchangeRateChartProps) {
  const [chartData, setChartData] = useState<HistoricalRatePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      setIsLoading(true);
      setError("");
      setChartData([]);

      try {
        const response = await fetch(
          `/api/rate-history?from=${encodeURIComponent(
            fromCurrency
          )}&to=${encodeURIComponent(toCurrency)}`,
          {
            signal: controller.signal,
          }
        );

        const data: HistoricalRateResponse = await response.json();

        if (!response.ok || !Array.isArray(data.data)) {
          throw new Error(
            data.error || "Unable to retrieve historical exchange rates."
          );
        }

        setChartData(data.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the chart."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [fromCurrency, toCurrency]);

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Exchange Rate Trend
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        Recent 7-day trend for {fromCurrency} → {toCurrency}.
      </p>

      {isLoading && (
        <p className="mt-6 text-sm text-gray-500">
          Loading historical rates...
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!isLoading && !error && chartData.length > 0 && (
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(value) =>
                  Number(value).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })
                }
              />

              <Tooltip
                labelFormatter={(value) =>
                  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                }
                formatter={(value) => [
                  Number(value).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  }),
                  `1 ${fromCurrency} in ${toCurrency}`,
                ]}
              />

              <Line
                type="monotone"
                dataKey="rate"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}