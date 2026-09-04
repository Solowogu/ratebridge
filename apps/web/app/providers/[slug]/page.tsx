import Link from "next/link";
import { notFound } from "next/navigation";
import { providers } from "../../data/providers";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return providers.map((provider) => ({
    slug: createSlug(provider.name),
  }));
}

type ProviderPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProviderPage({
  params,
}: ProviderPageProps) {
  const { slug } = await params;

  const provider = providers.find(
    (item) => createSlug(item.name) === slug
  );

  if (!provider) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="space-y-10">
        <header>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to comparison
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-800">
              {provider.initials}
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {provider.name}
              </h1>

              <p className="mt-1 text-gray-600">
                Money transfer provider overview
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Recommended for</p>
            <p className="mt-2 font-semibold text-gray-900">
              {provider.recommendedFor}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Typical delivery</p>
            <p className="mt-2 font-semibold text-gray-900">
              {provider.deliveryTime}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Coverage</p>
            <p className="mt-2 font-semibold text-gray-900">
              {provider.supportedCountries}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
  <p className="text-sm text-gray-500">Minimum transfer</p>
  <p className="mt-2 font-semibold text-gray-900">
    {provider.minimumTransfer.toLocaleString()}
  </p>
</div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Transfer methods
          </h2>

          <div className="flex flex-wrap gap-2">
            {provider.transferMethods.map((method) => (
              <span
                key={method}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
              >
                {method}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Available payout options
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-medium text-gray-900">Bank deposit</p>
              <p className="mt-1 text-sm text-gray-600">
                {provider.bankDeposit ? "Available" : "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-medium text-gray-900">Cash pickup</p>
              <p className="mt-1 text-sm text-gray-600">
                {provider.cashPickup ? "Available" : "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-medium text-gray-900">Mobile wallet</p>
              <p className="mt-1 text-sm text-gray-600">
                {provider.mobileWallet ? "Available" : "Not available"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Transfer limits
          </h2>

          <p className="leading-7 text-gray-600">
            RateBridge currently lists a minimum transfer of{" "}
            <strong>{provider.minimumTransfer.toLocaleString()}</strong> and a
            maximum transfer of{" "}
            <strong>{provider.maximumTransfer.toLocaleString()}</strong>.
            Actual limits may vary by currency, destination, payment method,
            account status, and provider requirements.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Important information
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Provider information shown on this page is for comparison purposes.
            Rates, fees, transfer limits, delivery times and availability may
            change. Always confirm the final details directly with the provider
            before sending money.
          </p>
        </section>

        <div>
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Visit {provider.name}
          </a>
        </div>
      </div>
    </main>
  );
}
