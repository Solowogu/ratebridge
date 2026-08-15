import Link from "next/link";

export default function AffiliateDisclosurePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Affiliate Disclosure
        </h1>

        <div className="mt-6 space-y-5 text-gray-700 leading-7">
          <p>
            RateBridge may participate in affiliate programs with some money
            transfer and financial service providers featured on this website.
          </p>

          <p>
            This means RateBridge may receive compensation when you click certain
            provider links and complete a qualifying transaction. This does not
            increase the price you pay.
          </p>

          <p>
            Affiliate relationships do not determine the order in which providers
            are displayed. RateBridge aims to present comparisons based on factors
            such as exchange rates, fees, delivery times, estimated recipient
            amounts, and other relevant provider information.
          </p>

          <p>
            Exchange rates, fees, availability, transfer limits, and delivery
            times may change. Always confirm the final terms directly with the
            provider before sending money.
          </p>

          <p>
            RateBridge does not provide financial, investment, tax, or legal
            advice. Information on this website is provided for general comparison
            and informational purposes only.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}