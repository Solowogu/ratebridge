"use client";

import { useCallback, useEffect, useState } from "react";

type FavoritePair = {
  id: string;
  from_currency: string;
  to_currency: string;
};

type FavoritePairsResponse = {
  success?: boolean;
  favorites?: FavoritePair[];
  favorite?: FavoritePair;
  error?: string;
};

type FavoriteCurrencyPairsProps = {
  currentFrom: string;
  currentTo: string;
  onSelectPair: (fromCurrency: string, toCurrency: string) => void;
};

export default function FavoriteCurrencyPairs({
  currentFrom,
  currentTo,
  onSelectPair,
}: FavoriteCurrencyPairsProps) {
  const [favorites, setFavorites] = useState<FavoritePair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/favorite-pairs", {
        cache: "no-store",
      });

      const data: FavoritePairsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load favorite currency pairs."
        );
      }

      setFavorites(data.favorites ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load favorite currency pairs."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function saveCurrentPair() {
    if (currentFrom === currentTo) {
      setMessage("Please select two different currencies.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/favorite-pairs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromCurrency: currentFrom,
          toCurrency: currentTo,
        }),
      });

      const data: FavoritePairsResponse = await response.json();

      if (!response.ok || !data.success || !data.favorite) {
        throw new Error(
          data.error || "Unable to save this currency pair."
        );
      }

      setFavorites((current) => [
        data.favorite as FavoritePair,
        ...current,
      ]);

      setMessage(
        `${currentFrom} → ${currentTo} added to favorites.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save this currency pair."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function removeFavorite(favoriteId: string) {
    setMessage("");

    try {
      const response = await fetch(
        `/api/favorite-pairs?id=${encodeURIComponent(favoriteId)}`,
        {
          method: "DELETE",
        }
      );

      const data: FavoritePairsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to remove this favorite."
        );
      }

      setFavorites((current) =>
        current.filter((favorite) => favorite.id !== favoriteId)
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to remove this favorite."
      );
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Favorite currency pairs
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Quick comparisons
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Save the currency pairs you compare most often.
          </p>
        </div>

        <button
          type="button"
          onClick={saveCurrentPair}
          disabled={isSaving}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSaving
            ? "Saving..."
            : `☆ Save ${currentFrom} → ${currentTo}`}
        </button>
      </div>

      {isLoading ? (
        <p className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          Loading favorite pairs...
        </p>
      ) : favorites.length === 0 ? (
        <p className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          You have not saved any favorite currency pairs yet.
        </p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white"
            >
              <button
                type="button"
                onClick={() =>
                  onSelectPair(
                    favorite.from_currency,
                    favorite.to_currency
                  )
                }
                className="px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700"
              >
                ⭐ {favorite.from_currency} →{" "}
                {favorite.to_currency}
              </button>

              <button
                type="button"
                onClick={() => removeFavorite(favorite.id)}
                aria-label={`Remove ${favorite.from_currency} to ${favorite.to_currency} from favorites`}
                className="border-l border-gray-300 px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {message && (
        <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </section>
  );
}