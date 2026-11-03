
import type { Metadata } from "next";
import Link from "next/link";
import { providers } from "../data/providers";

export const metadata: Metadata = {
  title: "Compare Money Transfer Providers | PagoSync",
  description:
    "Explore money transfer providers on PagoSync. Compare transfer options, delivery times, supported countries, and payout methods.",
  alternates: {
    canonical: "/providers",
  },
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProvidersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <Link
          href="/#compare"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to comparison
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
          Compare Money Transfer Providers
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          Explore money transfer providers available on PagoSync.
          Learn about their transfer options, supported destinations,
          delivery times, and payout methods before comparing offers.
        </p>
      </header>

      <section
        aria-label="Money transfer provider directory"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {providers.map((provider) => (
          <article
            key={provider.name}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                {provider.initials}
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                {provider.name}
              </h2>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-gray-800">
                  Recommended for
                </dt>
                <dd className="text-gray-600">
                  {provider.recommendedFor}
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-gray-800">
                  Delivery time
                </dt>
                <dd className="text-gray-600">
                  {provider.deliveryTime}
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-gray-800">
                  Supported countries
                </dt>
                <dd className="text-gray-600">
                  {provider.supportedCountries}
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-gray-800">
                  Payout methods
                </dt>
                <dd className="text-gray-600">
                  {[
                    provider.bankDeposit && "Bank deposit",
                    provider.cashPickup && "Cash pickup",
                    provider.mobileWallet && "Mobile wallet",
                  ]
                    .filter(Boolean)
                    .join(", ") || "Check provider details"}
                </dd>
              </div>
            </dl>

            <Link
              href={`/providers/${createSlug(provider.name)}`}
              className="mt-6 inline-flex font-semibold text-blue-600 hover:text-blue-800"
            >
              View provider details →
            </Link>
          </article>
        ))}
      </section>

      <p className="mt-10 text-sm text-gray-500">
        Provider information is for general comparison purposes.
        Availability, fees, exchange rates, and delivery times may
        vary by transfer route and payment method. Confirm current
        details with the provider before sending money.
      </p>
    </main>
  );
}
