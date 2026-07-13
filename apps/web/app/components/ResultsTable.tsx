type ResultsTableProps = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  liveRate: number;
};

export default function ResultsTable({
  amount,
  fromCurrency,
  toCurrency,
  liveRate,
}: ResultsTableProps) {
  const providers = [
    {
      name: "Wise",
      rate: liveRate * 0.995,
      fee: 5.99,
    },
    {
      name: "Remitly",
      rate: liveRate * 0.99,
      fee: 3.99,
    },
    {
      name: "Western Union",
      rate: liveRate * 0.98,
      fee: 0,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="text-2xl font-bold text-slate-900">
          Live Comparison Results
        </h3>

        <p className="mt-1 text-slate-600">
          Live market rate: 1 {fromCurrency} ={" "}
          {liveRate.toLocaleString(undefined, {
            maximumFractionDigits: 4,
          })}{" "}
          {toCurrency}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Estimated Rate</th>
              <th className="px-6 py-4">Fee</th>
              <th className="px-6 py-4">Recipient Gets</th>
            </tr>
          </thead>

          <tbody>
            {providers.map((provider) => {
              const transferableAmount = Math.max(amount - provider.fee, 0);
              const recipientGets = transferableAmount * provider.rate;

              return (
                <tr
                  key={provider.name}
                  className="border-t border-slate-200"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {provider.name}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    1 {fromCurrency} ={" "}
                    {provider.rate.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}{" "}
                    {toCurrency}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {provider.fee.toFixed(2)} {fromCurrency}
                  </td>

                  <td className="px-6 py-4 font-semibold text-blue-600">
                    {recipientGets.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    {toCurrency}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="px-6 py-4 text-sm text-slate-500">
        Provider rates and fees are estimated for demonstration. The market rate
        is live, but final provider quotes may differ.
      </p>
    </div>
  );
}