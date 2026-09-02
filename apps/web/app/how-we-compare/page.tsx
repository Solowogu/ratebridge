export default function HowWeComparePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="space-y-10">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            RateBridge methodology
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            How we compare money transfer providers
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
            RateBridge helps users compare international money transfer
            providers using exchange rates, fees, delivery information and
            estimated recipient amounts. We aim to make it clear which results
            come from current provider-supplied data and which are RateBridge
            estimates.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Live quotes and estimated results
          </h2>

          <p className="leading-7 text-gray-600">
            Results labelled LIVE use current provider-supplied quote data where
            that data is available to RateBridge. Results labelled ESTIMATE are
            comparison estimates calculated by RateBridge and may differ from
            the final quote offered by the provider.
          </p>

          <p className="leading-7 text-gray-600">
            Rates, fees, transfer methods and availability can change. Users
            should always confirm the final transaction details directly with
            the provider before sending money.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            How recipient amounts are calculated
          </h2>

          <p className="leading-7 text-gray-600">
            Where available, RateBridge considers the exchange rate and any
            stated transfer fee when calculating how much a recipient may
            receive. Estimated results are intended for comparison purposes and
            are not guaranteed transaction offers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            How providers are ranked
          </h2>

          <p className="leading-7 text-gray-600">
            By default, RateBridge can rank available results by recipient
            value. Users may also sort or filter providers using other factors,
            including fees, ratings, delivery speed and saved favourites.
          </p>

          <p className="leading-7 text-gray-600">
            Live quotes and estimated results are identified separately so users
            can understand the type of data behind each comparison.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Provider availability
          </h2>

          <p className="leading-7 text-gray-600">
            Not every provider supports every currency pair, transfer amount,
            country or transfer method. A provider may also be temporarily
            unavailable if its data source cannot be reached.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Affiliate relationships
          </h2>

          <p className="leading-7 text-gray-600">
            RateBridge may earn a commission when a user clicks a provider link
            and completes a qualifying transaction. This does not change the
            rates, fees or provider information shown in our comparison.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Important reminder
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            RateBridge is a comparison platform. We do not send, hold or receive
            customer funds. Final rates, fees, eligibility requirements and
            transaction terms are determined by the selected provider.
          </p>
        </section>
      </div>
    </main>
  );
}