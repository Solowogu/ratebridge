"use client";

type Provider = {
  name: string;
  rating: number;
  fee: number;
  deliveryTime: string;
  website: string;
};

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
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {provider.name}
            </h2>

            <p className="mt-1 text-gray-600">
              ⭐ {provider.rating.toFixed(1)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Transfer fee</span>
            <strong>
              {provider.fee === 0
                ? "No fee"
                : `$${provider.fee.toFixed(2)}`}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <strong>{provider.deliveryTime}</strong>
          </div>

          <div className="flex justify-between">
            <span>Website</span>

            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600"
            >
              Visit
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}