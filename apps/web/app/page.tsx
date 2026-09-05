import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Features from "./components/Features";
import ExchangeForm from "./components/ExchangeForm";
import AffiliateDisclosure from "./components/AffiliateDisclosure";

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
    </>
  );
}