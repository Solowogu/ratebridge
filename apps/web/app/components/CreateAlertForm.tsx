"use client";

import { FormEvent, useState } from "react";

const currencies = ["CAD", "USD", "EUR", "GBP", "NGN"];

type RateResponse = {
  rate?: number;
  error?: string;
};

type AlertResponse = {
  success?: boolean;
  error?: string;
};

export default function CreateAlertForm() {
  const [baseCurrency, setBaseCurrency] = useState("CAD");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [targetRate, setTargetRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericTargetRate = Number(targetRate);

    if (
      !Number.isFinite(numericTargetRate) ||
      numericTargetRate <= 0
    ) {
      setMessage("Please enter a valid target rate.");
      return;
    }

    if (baseCurrency === targetCurrency) {
      setMessage("Please select two different currencies.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const rateResponse = await fetch(
  `/api/exchange-rate?from=${encodeURIComponent(
    baseCurrency
  )}&to=${encodeURIComponent(
    targetCurrency
  )}&amount=1`,
  {
    cache: "no-store",
  }
);

      const rateData: RateResponse = await rateResponse.json();

      if (
        !rateResponse.ok ||
        !Number.isFinite(rateData.rate)
      ) {
        throw new Error(
          rateData.error || "Unable to retrieve the current rate."
        );
      }

      const alertResponse = await fetch("/api/rate-alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromCurrency: baseCurrency,
          toCurrency: targetCurrency,
          targetRate: numericTargetRate,
          currentRate: Number(rateData.rate),
        }),
      });

      const alertData: AlertResponse =
        await alertResponse.json();

      if (!alertResponse.ok || !alertData.success) {
        throw new Error(
          alertData.error || "Unable to create alert."
        );
      }

      setMessage("Rate alert created successfully!");
      setTargetRate("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create alert."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Create Rate Alert
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Receive an email when your target exchange rate is
          reached.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="baseCurrency"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            From
          </label>

          <select
            id="baseCurrency"
            value={baseCurrency}
            onChange={(event) => {
              setBaseCurrency(event.target.value);
              setMessage("");
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="targetCurrency"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            To
          </label>

          <select
            id="targetCurrency"
            value={targetCurrency}
            onChange={(event) => {
              setTargetCurrency(event.target.value);
              setMessage("");
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="targetRate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Target Rate
          </label>

          <input
            id="targetRate"
            type="number"
            min="0.000001"
            step="any"
            value={targetRate}
            onChange={(event) => {
              setTargetRate(event.target.value);
              setMessage("");
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
            placeholder="e.g. 0.75"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting ? "Creating alert..." : "Create Alert"}
      </button>

      {message && (
        <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </form>
  );
}