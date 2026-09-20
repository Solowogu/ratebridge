import type { Metadata } from "next";
import Link from "next/link";
import { providers } from "./data/providers";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Features from "./components/Features";
import ExchangeForm from "./components/ExchangeForm";
import AffiliateDisclosure from "./components/AffiliateDisclosure";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <section className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-32">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 sm:text-sm">
            Trusted Exchange Rate Platform
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:mt-8 sm:text-6xl">
           Compare Exchange Rates{" "}
<br className="hidden sm:block" />
Like Never Before
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:mt-8 sm:text-xl">
            Find the best exchange rates from trusted providers, compare fees,
            monitor live currency movements, and save money on every
            international transfer.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
            <a
              href="#compare"
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700 sm:w-auto sm:px-8 sm:py-4"
            >
              Compare Rates
            </a>

            <a
              href="/about"
              className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold hover:bg-slate-100 sm:w-auto sm:px-8 sm:py-4"
            >
              Learn More
            </a>
          </div>
        </section>
      </main>

      <Dashboard />

      <Features />

      <AffiliateDisclosure />

      <section id="compare" className="scroll-mt-24">
        <ExchangeForm />
      </section>

      <section
        aria-labelledby="explore-providers"
        className="bg-white px-4 py-16 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="explore-providers"
            className="text-3xl font-bold text-slate-900"
          >
            Explore money transfer providers
          </h2>

          <p className="mt-3 max-w-3xl text-slate-600">
            Learn about the providers available on PagoSync,
            including their transfer options and delivery methods.
            Compare rates and fees before choosing where to send money.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const slug = provider.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

              return (
                <Link
                  key={provider.name}
                  href={`/providers/${slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">
                    {provider.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {provider.recommendedFor}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    Explore provider →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}