type BestProviderCardProps = {
  providerName: string;
  rating: number;
  fee: number;
  deliveryTime: string;
  recipientReceives: number;
  averageReceives: number;
  currency: string;
  fromCurrency: string;
};

export default function BestProviderCard({
  providerName,
  rating,
  fee,
  deliveryTime,
  recipientReceives,
  averageReceives,
  currency,
  fromCurrency,
}: BestProviderCardProps) {
  const savings = recipientReceives - averageReceives;

  return (
    <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏆</span>

        <div>
          <p className="text-sm font-semibold uppercase text-green-700">
            Best Overall
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            {providerName}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-4">

        <div>
          <p className="text-sm text-gray-500">
            Recipient receives
          </p>

          <p className="text-xl font-bold text-green-700">
            {recipientReceives.toLocaleString(undefined,{
              minimumFractionDigits:2,
              maximumFractionDigits:2,
            })}{" "}
            {currency}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Rating
          </p>

          <p className="font-semibold">
            ⭐ {rating.toFixed(1)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Fee
          </p>

          <p className="font-semibold">
            {fee === 0
              ? "No fee"
              : `${fee.toFixed(2)} ${fromCurrency}`}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Delivery
          </p>

          <p className="font-semibold">
            {deliveryTime}
          </p>
        </div>

      </div>

      <div className="mt-6 rounded-xl bg-white p-4">
        <p className="font-medium text-gray-700">
          You receive{" "}
          <span className="font-bold text-green-700">
            {savings.toLocaleString(undefined,{
              minimumFractionDigits:2,
              maximumFractionDigits:2,
            })}{" "}
            {currency}
          </span>{" "}
          more than the average provider.
        </p>
      </div>
    </div>
  );
}