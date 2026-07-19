"use client";

import type { Provider } from "../data/providers";

type ProviderDetailsModalProps = {
  provider: Provider | null;
  onClose: () => void;
};

export default function ProviderDetailsModal({
  provider,
  onClose,
}: ProviderDetailsModalProps) {
  if (!provider) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {provider.name}
            </h2>

            <p className="mt-1 text-gray-600">
              ⭐ {provider.rating.toFixed(1)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close provider details"
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">
            Recommended for
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {provider.recommendedFor}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Transfer fee</p>
            <p className="mt-1 font-semibold text-gray-900">
              {provider.fee === 0
                ? "No fee"
                : `${provider.fee.toFixed(2)} CAD`}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Delivery</p>
            <p className="mt-1 font-semibold text-gray-900">
              {provider.deliveryTime}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              Minimum transfer
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {provider.minimumTransfer.toLocaleString()} CAD
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              Maximum transfer
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {provider.maximumTransfer.toLocaleString()} CAD
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">
            Supported countries
          </h3>

          <p className="mt-2 text-gray-600">
            {provider.supportedCountries}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">
            Transfer methods
          </h3>

          <ul className="mt-2 space-y-2">
            {provider.transferMethods.map((method) => (
              <li
                key={method}
                className="flex items-center gap-2 text-gray-700"
              >
                <span className="font-bold text-green-600">✓</span>
                {method}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Bank deposit</p>
            <p className="mt-1 font-semibold">
              {provider.bankDeposit ? "✓ Yes" : "✗ No"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Cash pickup</p>
            <p className="mt-1 font-semibold">
              {provider.cashPickup ? "✓ Yes" : "✗ No"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Mobile wallet</p>
            <p className="mt-1 font-semibold">
              {provider.mobileWallet ? "✓ Yes" : "✗ No"}
            </p>
          </div>
        </div>

        <a
          href={provider.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          Visit {provider.name}
        </a>
      </div>
    </div>
  );
}