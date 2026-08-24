"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

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

  const [currentRate, setCurrentRate] =
    useState<number | null>(null);

  const [isLoadingRate, setIsLoadingRate] =
    useState(false);

  const [rateError, setRateError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (baseCurrency === targetCurrency) {
      setCurrentRate(null);
      setRateError("");
      return;
    }

    let cancelled = false;

    async function loadCurrentRate() {
      setIsLoadingRate(true);
      setRateError("");
      setCurrentRate(null);

      try {
        const response = await fetch(
          `/api/exchange-rate?from=${encodeURIComponent(
            baseCurrency
          )}&to=${encodeURIComponent(
            targetCurrency
          )}&amount=1`,
          {
            cache: "no-store",
          }
        );

        const data: RateResponse = await response.json();

        if (
          !response.ok ||
          !Number.isFinite(data.rate)
        ) {
          throw new Error(
            data.error ||
              "Unable to retrieve the current rate."
          );
        }

        if (!cancelled) {
          setCurrentRate(Number(data.rate));
        }
      } catch (error) {
        if (!cancelled) {
          setRateError(
            error instanceof Error
              ? error.message
              : "Unable to retrieve the current rate."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRate(false);
        }
      }
    }

    loadCurrentRate();

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, targetCurrency]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericTargetRate = Number(targetRate);

    if (baseCurrency === targetCurrency) {
      setMessage(
        "Please select two different currencies."
      );
      return;
    }

    if (
      !Number.isFinite(numericTargetRate) ||
      numericTargetRate <= 0
    ) {
      setMessage(
        "Please enter a valid target rate."
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      let latestRate = currentRate;

      if (!Number.isFinite(latestRate)) {
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

        const rateData: RateResponse =
          await rateResponse.json();

        if (
          !rateResponse.ok ||
          !Number.isFinite(rateData.rate)
        ) {
          throw new Error(
            rateData.error ||
              "Unable to retrieve the current rate."
          );
        }

        latestRate = Number(rateData.rate);
        setCurrentRate(latestRate);
      }

      const alertResponse = await fetch(
        "/api/rate-alerts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromCurrency: baseCurrency,
            toCurrency: targetCurrency,
            targetRate: numericTargetRate,
            currentRate: latestRate,
          }),
        }
      );

      const alertData: AlertResponse =
        await alertResponse.json();

      if (
        !alertResponse.ok ||
        !alertData.success
      ) {
        throw new Error(
          alertData.error ||
            "Unable to create alert."
        );
      }

      setMessage(
        "Rate alert created successfully!"
      );
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

  const numericTargetRate = Number(targetRate);

  const targetIsBelowCurrent =
    currentRate !== null &&
    Number.isFinite(numericTargetRate) &&
    numericTargetRate > 0 &&
    numericTargetRate <= currentRate;

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
          Receive an email when your target exchange
          rate is reached.
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
              <option
                key={currency}
                value={currency}
                disabled={
                  currency === targetCurrency
                }
              >
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
              <option
                key={currency}
                value={currency}
                disabled={
                  currency === baseCurrency
                }
              >
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

      <div className="rounded-xl bg-blue-50 px-4 py-3">
        {isLoadingRate ? (
          <p className="text-sm font-medium text-blue-700">
            Loading current rate...
          </p>
        ) : rateError ? (
          <p className="text-sm font-medium text-red-600">
            {rateError}
          </p>
        ) : currentRate !== null ? (
          <>
            <p className="text-sm font-semibold text-gray-900">
              Current rate: 1 {baseCurrency} ={" "}
              {currentRate.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 6,
                }
              )}{" "}
              {targetCurrency}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Set a target above the current rate if
              you want to be notified when the rate
              improves.
            </p>

            {targetIsBelowCurrent && (
              <p className="mt-2 text-sm font-semibold text-amber-700">
                Your target is already at or below the
                current rate, so this alert may trigger
                on the next scheduled check.
              </p>
            )}
          </>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={
          isSubmitting ||
          isLoadingRate ||
          currentRate === null
        }
        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting
          ? "Creating alert..."
          : "Create Alert"}
      </button>

      {message && (
        <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </form>
  );
}