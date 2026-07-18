"use client";

import { useState } from "react";

import { providers } from "../data/providers";

type ResultsTableProps = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  liveRate: number;
};

const badgeClasses = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-800",
};

export default function ResultsTable({
  amount,
  fromCurrency,
  toCurrency,
  liveRate,
}: ResultsTableProps) {
  const [sortBy, setSortBy] = useState<
  "bestValue" | "lowestFee" | "highestRating"
>("bestValue");
  const [noFeeOnly, setNoFeeOnly] = useState(false);

  const [highRatingOnly, setHighRatingOnly] = useState(false);

  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const rankedProviders = providers
  .filter((provider) => {
    if (noFeeOnly && provider.fee > 0) {
      return false;
    }

    if (highRatingOnly && provider.rating < 4.5) {
      return false;
    }

    if (
      fastDeliveryOnly &&
      !provider.deliveryTime.toLowerCase().includes("minute") &&
      !provider.deliveryTime.toLowerCase().includes("1 day")
    ) {
      return false;
    }

    return true;
  })
  .map((provider) => {
      const rate = liveRate * provider.rateMultiplier;
      const amountAfterFee = Math.max(amount - provider.fee, 0);
      const recipientReceives = amountAfterFee * rate;
      
      return {
        ...provider,
        rate,
        recipientReceives,
      };
    })
    .sort((firstProvider, secondProvider) => {
      if (sortBy === "lowestFee") {
        return firstProvider.fee - secondProvider.fee;
      }

      if (sortBy === "highestRating") {
        return secondProvider.rating - firstProvider.rating;
      }

      return (
        secondProvider.recipientReceives -
        firstProvider.recipientReceives
       );
     });
 
  const bestRecipientAmount = Math.max(
  ...rankedProviders.map((provider) => provider.recipientReceives)
  );

  const bestProvider = rankedProviders.find(
  (provider) => provider.recipientReceives === bestRecipientAmount
  );

 return (
  <>
    {bestProvider && (
      <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          Best provider today
        </p>

        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${
                badgeClasses[bestProvider.badgeColor]
              }`}
            >
              {bestProvider.initials}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {bestProvider.name}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                ⭐ {bestProvider.rating.toFixed(1)} ·{" "}
                {bestProvider.deliveryTime}
              </p>
            </div>
          </div>

          <a
            href={bestProvider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-green-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-800"
          >
            Visit {bestProvider.name}
          </a>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4">
            <p className="text-sm text-gray-500">Recipient receives</p>
            <p className="mt-1 text-xl font-bold text-green-700">
              {bestProvider.recipientReceives.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {toCurrency}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-sm text-gray-500">Estimated fee</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {bestProvider.fee === 0
                ? "No fee"
                : `${bestProvider.fee.toFixed(2)} ${fromCurrency}`}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-sm text-gray-500">Estimated rate</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {bestProvider.rate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}{" "}
              {toCurrency}
            </p>
          </div>
        </div>
      </div>
    )}

    <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
  <p className="mb-3 text-sm font-medium text-gray-700">
    Filter providers
  </p>

  <div className="flex flex-wrap gap-4">
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={noFeeOnly}
        onChange={(event) => setNoFeeOnly(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600"
      />
      No fee
    </label>

    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={highRatingOnly}
        onChange={(event) => setHighRatingOnly(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600"
      />
      Rating 4.5+
    </label>

    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={fastDeliveryOnly}
        onChange={(event) => setFastDeliveryOnly(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600"
      />
      Fast delivery
    </label>
  </div>
</div>

      <p className="border-t border-gray-100 px-6 py-3 text-xs text-gray-500 md:hidden">
        Swipe horizontally to view all comparison details.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Provider</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Exchange rate</th>
              <th className="px-6 py-4 font-medium">Fee</th>
              <th className="px-6 py-4 font-medium">Delivery time</th>
              <th className="px-6 py-4 font-medium">Recipient receives</th>
              <th className="px-6 py-4 font-medium">Compared with best</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rankedProviders.map((provider) => (
              <tr
                key={provider.name}
               className={`transition hover:bg-gray-50 ${
                 provider.recipientReceives === bestRecipientAmount
                   ? "bg-green-50/60"
                   : ""
               }`}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        badgeClasses[provider.badgeColor]
                      }`}
                    >
                      {provider.initials}
                    </div>

                    <div>
                      <span className="font-semibold text-gray-900">
                        {provider.name}
                      </span>

                      {provider.recipientReceives === bestRecipientAmount && (
                        <div className="mt-1">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            Best deal
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-gray-700">
                  <span aria-label={`${provider.rating} out of 5 stars`}>
                    ⭐ {provider.rating.toFixed(1)}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-gray-700">
                  1 {fromCurrency} ={" "}
                  {provider.rate.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{" "}
                  {toCurrency}
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-gray-700">
                  {provider.fee === 0
                    ? "No fee"
                    : `${provider.fee.toFixed(2)} ${fromCurrency}`}
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-gray-700">
                  {provider.deliveryTime}
                </td>

                <td className="whitespace-nowrap px-6 py-5 font-bold text-green-700">
                  {provider.recipientReceives.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {toCurrency}
                </td>
<td className="whitespace-nowrap px-6 py-5">
 {provider.recipientReceives === bestRecipientAmount ? (
  <span className="font-semibold text-green-700">
    Best value
  </span>
) : (
    <span className="font-medium text-red-600">
      {(
        bestRecipientAmount - provider.recipientReceives
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}{" "}
      {toCurrency} less
    </span>
  )}
</td>
                <td className="px-6 py-5">
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Visit provider
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
       <p className="text-xs leading-5 text-gray-500">
          Provider rates, fees, ratings, and delivery times shown here are
          estimates for comparison purposes only. Confirm the final quote on the
          provider’s website before sending money.
        </p>
      </div>
    </div>
  </>
  );
}