type ResultsTableProps = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
};

export default function ResultsTable({
  amount,
  fromCurrency,
  toCurrency,
}: ResultsTableProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="text-2xl font-bold text-slate-900">
          Comparison Results
        </h3>

        <p className="mt-1 text-slate-600">
          Comparing {amount} {fromCurrency} to {toCurrency}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Exchange Rate</th>
              <th className="px-6 py-4">Fee</th>
              <th className="px-6 py-4">Recipient Gets</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-6 py-4 font-semibold">Wise</td>
              <td className="px-6 py-4">
                1 {fromCurrency} = 1,145 {toCurrency}
              </td>
              <td className="px-6 py-4">$5.99</td>
              <td className="px-6 py-4 font-semibold text-blue-600">
                {((amount - 5.99) * 1145).toLocaleString()} {toCurrency}
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="px-6 py-4 font-semibold">Remitly</td>
              <td className="px-6 py-4">
                1 {fromCurrency} = 1,140 {toCurrency}
              </td>
              <td className="px-6 py-4">$3.99</td>
              <td className="px-6 py-4 font-semibold text-blue-600">
                {((amount - 3.99) * 1140).toLocaleString()} {toCurrency}
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="px-6 py-4 font-semibold">Western Union</td>
              <td className="px-6 py-4">
                1 {fromCurrency} = 1,130 {toCurrency}
              </td>
              <td className="px-6 py-4">$0.00</td>
              <td className="px-6 py-4 font-semibold text-blue-600">
                {(amount * 1130).toLocaleString()} {toCurrency}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="px-6 py-4 text-sm text-slate-500">
        These are sample rates for demonstration purposes.
      </p>
    </div>
  );
}