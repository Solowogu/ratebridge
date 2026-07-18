import ExchangeRateChart from "./components/ExchangeRateChart";
import Navbar from "./components/Navbar";
import Features from "./components/Features";
import ExchangeForm from "./components/ExchangeForm";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <section className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Trusted Exchange Rate Platform
          </span>

          <h1 className="mt-8 text-6xl font-extrabold text-slate-900">
            Compare Exchange Rates
            <br />
            Like Never Before
          </h1>

          <p className="mt-8 max-w-3xl text-xl text-slate-600">
            Find the best exchange rates from trusted providers, compare fees,
            monitor live currency movements, and save money on every international
            transfer.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700">
              Compare Rates
            </button>

            <button className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold hover:bg-slate-100">
              Learn More
            </button>
          </div>
        </section>
      </main>

      <Features />
      <ExchangeForm />
      <ExchangeRateChart />
    </>
  );
}