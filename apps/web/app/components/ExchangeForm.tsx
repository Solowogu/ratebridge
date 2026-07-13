"use client";

import { useState } from "react";
import ResultsTable from "./ResultsTable";

type LiveRateData = {
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
};

export default function ExchangeForm() {
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("CAD");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [rateData, setRateData] = useState<LiveRateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError("");
    setRateData(null);

    try {
      const response = await fetch(
        `/api/exchange-rate?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve the exchange rate.");
      }

      setRateData(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while retrieving the rate.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="font-semibold text-blue-600">Compare currencies</p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Find the best exchange rate
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Enter an amount and choose the currencies you want to compare.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block font-semibold text-slate-700"
              >
                Amount
              </label>

              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="fromCurrency"
                className="mb-2 block font-semibold text-slate-700"
              >
                From
              </label>

              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(event) => setFromCurrency(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="USD">USD — US Dollar</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
                <option value="NGN">NGN — Nigerian Naira</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="toCurrency"
                className="mb-2 block font-semibold text-slate-700"
              >
                To
              </label>

              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(event) => setToCurrency(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="NGN">NGN — Nigerian Naira</option>
                <option value="USD">USD — US Dollar</option>
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isLoading ? "Loading live rate..." : "Compare Rates"}
          </button>

          {error && (
            <p className="mt-4 text-center font-medium text-red-600">{error}</p>
          )}
        </form>
      </div>

      {rateData && (
        <div className="mx-auto mt-12 max-w-6xl">
          <ResultsTable
            amount={rateData.amount}
            fromCurrency={rateData.from}
            toCurrency={rateData.to}
            liveRate={rateData.rate}
          />
        </div>
      )}
    </section>
  );
}