"use client";

import { FormEvent, useState } from "react";

type RateAlertFormProps = {
  fromCurrency: string;
  toCurrency: string;
  currentRate: number;
};

type RateAlertResponse = {
  success?: boolean;
  error?: string;
};

export default function RateAlertForm({
  fromCurrency,
  toCurrency,
  currentRate,
}: RateAlertFormProps) {
  const [targetRate, setTargetRate] = useState(
    currentRate.toFixed(4)
  );
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/rate-alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          fromCurrency,
          toCurrency,
          targetRate: numericTargetRate,
          currentRate,
        }),
      });

      const data: RateAlertResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to create alert.");
      }

      setMessage("✅ Rate alert created successfully!");
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Rate alert
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Get notified when your target rate is reached
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Current rate: 1 {fromCurrency} ={" "}
          {currentRate.toLocaleString(undefined, {
            maximumFractionDigits: 6,
          })}{" "}
          {toCurrency}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 md:grid-cols-2"
      >
        <div>
          <label
            htmlFor="targetRate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Target rate
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
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="alertEmail"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="alertEmail"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage("");
            }}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 md:col-span-2"
        >
          {isSubmitting ? "Creating alert..." : "Create Rate Alert"}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700">
          {message}
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-gray-500">
        Email notifications will be activated after scheduled rate checks
        are added.
      </p>
    </div>
  );
}