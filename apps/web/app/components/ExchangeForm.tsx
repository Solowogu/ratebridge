"use client";

import { FormEvent, useState } from "react";
import ResultsTable from "./ResultsTable";
import { providers } from "../data/providers";

type RateResponse = {
  rate?: number;
  base?: string;
  target?: string;
  date?: string;
  error?: string;
};

type SaveComparisonResponse = {
  success: boolean;
  error?: string;
};

export default function ExchangeForm() {
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("CAD");
  const [toCurrency, setToCurrency] = useState("USD");

  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);
  const [submittedFrom, setSubmittedFrom] = useState("");
  const [submittedTo, setSubmittedTo] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rateDate, setRateDate] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setLiveRate(null);
    setError("");
    setSaveMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter an amount greater than zero.");
      setLiveRate(null);
      setSaveMessage("");
      return;
    }

    setIsLoading(true);
    setError("");
    setSaveMessage("");
    setLiveRate(null);

    try {
      const response = await fetch(
        `/api/rates?from=${encodeURIComponent(
          fromCurrency
        )}&to=${encodeURIComponent(toCurrency)}`
      );

      const data: RateResponse = await response.json();

      if (!response.ok || typeof data.rate !== "number") {
        throw new Error(data.error || "Unable to retrieve the exchange rate.");
      }

      setLiveRate(data.rate);
      setSubmittedAmount(numericAmount);
      setSubmittedFrom(fromCurrency);
      setSubmittedTo(toCurrency);
      setRateDate(data.date ?? "");

      const rankedProviders = providers
        .map((provider) => {
          const providerRate = data.rate! * provider.rateMultiplier;
          const amountAfterFee = Math.max(
            numericAmount - provider.fee,
            0
          );
          const recipientReceives = amountAfterFee * providerRate;

          return {
            name: provider.name,
            recipientReceives,
          };
        })
        .sort(
          (firstProvider, secondProvider) =>
            secondProvider.recipientReceives -
            firstProvider.recipientReceives
        );

      const bestProvider = rankedProviders[0];

      if (bestProvider) {
        try {
          const saveResponse = await fetch("/api/comparisons", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: numericAmount,
              fromCurrency,
              toCurrency,
              referenceRate: data.rate,
              bestProvider: bestProvider.name,
              bestRecipientAmount: bestProvider.recipientReceives,
            }),
          });

          const saveData: SaveComparisonResponse =
            await saveResponse.json();

          if (saveResponse.ok && saveData.success) {
            setSaveMessage("Comparison saved successfully.");
          } else {
            setSaveMessage(
              "Results displayed, but the comparison was not saved."
            );
          }
        } catch {
          setSaveMessage(
            "Results displayed, but the comparison was not saved."
          );
        }
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while retrieving the rate."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Compare currencies
          </h2>

          <p className="mt-2 text-gray-600">
            Enter an amount and choose the currencies you want to compare.
          </p>
        </div>

       <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-[1fr_1fr_auto_1fr]"
      >
  <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="fromCurrency"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              From
            </label>

            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(event) => setFromCurrency(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            >
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="NGN">NGN — Nigerian Naira</option>
            </select>
          </div>
 <div className="flex items-end justify-center">
   <button
      type="button"
      onClick={swapCurrencies}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-xl font-bold text-blue-600 hover:bg-blue-50"
  >
    ⇄
  </button>
</div>
          <div>
            <label
              htmlFor="toCurrency"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              To
            </label>

            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(event) => setToCurrency(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="NGN">NGN — Nigerian Naira</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 md:col-span-4"
          >
            {isLoading ? "Checking rate..." : "Compare Rates"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {saveMessage && (
          <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {saveMessage}
          </p>
        )}

        {liveRate !== null &&
          submittedAmount !== null &&
          submittedFrom &&
          submittedTo && (
            <>
              {rateDate && (
                <p className="mt-4 text-sm text-gray-500">
                  Reference rate date: {rateDate}
                </p>
              )}

              <ResultsTable
                amount={submittedAmount}
                fromCurrency={submittedFrom}
                toCurrency={submittedTo}
                liveRate={liveRate}
              />
            </>
          )}
      </div>
    </section>
  );
}