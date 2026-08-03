"use client";

import { useEffect, useMemo, useState } from "react";

type RangeKey = "7D" | "30D" | "90D" | "1Y";

type RatePoint = {
  date: string;
  rate: number;
};

type RateHistoryResponse = {
  from?: string;
  to?: string;
  range?: RangeKey;
  data?: RatePoint[];
  error?: string;
};

type RateHistoryChartProps = {
  fromCurrency: string;
  toCurrency: string;
};

const ranges: RangeKey[] = ["7D", "30D", "90D", "1Y"];

export default function RateHistoryChart({
  fromCurrency,
  toCurrency,
}: RateHistoryChartProps) {
  const [range, setRange] = useState<RangeKey>("7D");
  const [data, setData] = useState<RatePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadHistory() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/rate-history?from=${encodeURIComponent(
            fromCurrency
          )}&to=${encodeURIComponent(
            toCurrency
          )}&range=${range}`,
          {
            cache: "no-store",
          }
        );

        const result: RateHistoryResponse =
          await response.json();

        if (!response.ok || !result.data) {
          throw new Error(
            result.error ||
              "Unable to load historical exchange rates."
          );
        }

        if (!isCancelled) {
          setData(result.data);
        }
      } catch (error) {
        if (!isCancelled) {
          setData([]);
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load historical exchange rates."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isCancelled = true;
    };
  }, [fromCurrency, toCurrency, range]);

  const chartValues = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    const rates = data.map((point) => point.rate);
    const minimum = Math.min(...rates);
    const maximum = Math.max(...rates);
    const latest = rates[rates.length - 1];

    const width = 800;
    const height = 260;
    const paddingX = 32;
    const paddingY = 24;

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const rateRange = maximum - minimum || 1;

    const points = data.map((point, index) => {
      const x =
        paddingX +
        (data.length === 1
          ? usableWidth / 2
          : (index / (data.length - 1)) * usableWidth);

      const y =
        paddingY +
        ((maximum - point.rate) / rateRange) * usableHeight;

      return {
        ...point,
        x,
        y,
      };
    });

    const polylinePoints = points
      .map((point) => `${point.x},${point.y}`)
      .join(" ");

    return {
      width,
      height,
      minimum,
      maximum,
      latest,
      points,
      polylinePoints,
    };
  }, [data]);

  return (
    <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Historical exchange rate
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {fromCurrency} → {toCurrency}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Review how the reference rate has changed over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ranges.map((rangeOption) => (
            <button
              key={rangeOption}
              type="button"
              onClick={() => setRange(rangeOption)}
              className={
                range === rangeOption
                  ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              }
            >
              {rangeOption}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 rounded-xl bg-gray-50 p-10 text-center text-gray-600">
          Loading historical rates...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-xl bg-red-50 p-6 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : chartValues ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Latest rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {chartValues.latest.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Lowest rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {chartValues.minimum.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Highest rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {chartValues.maximum.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartValues.width} ${chartValues.height}`}
              className="h-auto w-full min-w-[700px]"
              role="img"
              aria-label={`${range} historical exchange-rate chart for ${fromCurrency} to ${toCurrency}`}
            >
              <line
                x1="32"
                y1="24"
                x2="32"
                y2="236"
                stroke="currentColor"
                className="text-gray-300"
              />

              <line
                x1="32"
                y1="236"
                x2="768"
                y2="236"
                stroke="currentColor"
                className="text-gray-300"
              />

              <polyline
                points={chartValues.polylinePoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              />

              {chartValues.points.map((point) => (
                <g key={point.date}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="currentColor"
                    className="text-blue-600"
                  />

                  <title>
                    {point.date}: {point.rate}
                  </title>
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-xs text-gray-500">
            <span>{data[0]?.date}</span>
            <span>{data[data.length - 1]?.date}</span>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-xl bg-gray-50 p-10 text-center text-gray-600">
          No historical rates are available.
        </div>
      )}
    </section>
  );
}