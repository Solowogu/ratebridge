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
  const rankedProviders = providers
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
    .sort(
      (firstProvider, secondProvider) =>
        secondProvider.recipientReceives -
        firstProvider.recipientReceives
    );
 
  const bestRecipientAmount =
    rankedProviders[0]?.recipientReceives ?? 0;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Compare Providers
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Compare the estimated amount your recipient could receive.
        </p>
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
            {rankedProviders.map((provider, index) => (
              <tr
                key={provider.name}
                className={`transition hover:bg-gray-50 ${
                  index === 0 ? "bg-green-50/60" : ""
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

                      {index === 0 && (
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
  {index === 0 ? (
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
  );
}