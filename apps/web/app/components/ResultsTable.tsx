"use client";

import { useState } from "react";
import BestProviderCard from "./BestProviderCard";
import ProviderDetailsModal from "./ProviderDetailsModal";
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
  purple: "bg-purple-100 text-purple-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  teal: "bg-teal-100 text-teal-700",
  pink: "bg-pink-100 text-pink-700",
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
  const [favoriteProviders, setFavoriteProviders] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<
  (typeof providers)[number] | null
>(null);
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
if (
  favoritesOnly &&
  !favoriteProviders.includes(provider.name)
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
      const firstIsFavorite = favoriteProviders.includes(
  firstProvider.name
);

const secondIsFavorite = favoriteProviders.includes(
  secondProvider.name
);

if (firstIsFavorite !== secondIsFavorite) {
  return firstIsFavorite ? -1 : 1;
}
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
  const averageRecipientAmount =
        rankedProviders.length > 0
        ? rankedProviders.reduce(
        (total, provider) => total + provider.recipientReceives,
        0
      ) / rankedProviders.length
    : 0;
 return (
  <>
    {bestProvider && (
  <BestProviderCard
    providerName={bestProvider.name}
    rating={bestProvider.rating}
    fee={bestProvider.fee}
    deliveryTime={bestProvider.deliveryTime}
    recipientReceives={bestProvider.recipientReceives}
    averageReceives={averageRecipientAmount}
    currency={toCurrency}
    fromCurrency={fromCurrency}
  />
 )}
            
  <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
  <div className="border-b border-gray-200 px-6 py-4">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Compare Providers
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Compare the estimated amount your recipient could receive.
        </p>
      </div>

      <div>
        <label
          htmlFor="providerSort"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Sort by
        </label>

        <select
          id="providerSort"
          value={sortBy}
          onChange={(event) =>
            setSortBy(
              event.target.value as
                | "bestValue"
                | "lowestFee"
                | "highestRating"
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="bestValue">Best value</option>
          <option value="lowestFee">Lowest fee</option>
          <option value="highestRating">Highest rating</option>
        </select>
      </div>
    </div>
  </div>

  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700">
          Filter providers
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4">
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
              onChange={(event) =>
                setHighRatingOnly(event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Rating 4.5+
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={fastDeliveryOnly}
              onChange={(event) =>
                setFastDeliveryOnly(event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Fast delivery
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
           <input
             type="checkbox"
             checked={favoritesOnly}
             onChange={(event) =>
               setFavoritesOnly(event.target.checked)
            }
    className="h-4 w-4 rounded border-gray-300 text-blue-600"
  />
  Favorites only
</label>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setNoFeeOnly(false);
          setHighRatingOnly(false);
          setFastDeliveryOnly(false);
          setFavoritesOnly(false);
          setFavoriteProviders([]);
        }}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Reset filters
      </button>
    </div>
  </div>
      <p className="border-t border-gray-100 px-6 py-3 text-xs text-gray-500 md:hidden">
        Swipe horizontally to view all comparison details.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium text-center">
               ★
             </th>
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
                <td className="px-6 py-5 text-center">
  <button
    type="button"
    onClick={() => {
      setFavoriteProviders((current) =>
        current.includes(provider.name)
          ? current.filter((name) => name !== provider.name)
          : [...current, provider.name]
      );
    }}
    className="text-2xl transition hover:scale-110"
  >
    {favoriteProviders.includes(provider.name)
      ? "⭐"
      : "☆"}
  </button>
</td>
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
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => setSelectedProvider(provider)}
      className="inline-flex whitespace-nowrap rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
    >
      Details
    </button>

    <a
      href={provider.website}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Visit
    </a>
  </div>
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
    <ProviderDetailsModal
     provider={selectedProvider}
     onClose={() => setSelectedProvider(null)}
  />
  </>
  );
}