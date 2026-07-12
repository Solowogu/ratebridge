export default function Features() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-semibold text-blue-600">Why RateBridge?</p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Everything you need to make smarter transfers
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Live Exchange Rates
            </h3>
            <p className="mt-4 text-slate-600">
              Monitor current currency rates across major currencies.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Compare Providers
            </h3>
            <p className="mt-4 text-slate-600">
              Compare rates, fees, and transfer delivery times.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Rate Alerts</h3>
            <p className="mt-4 text-slate-600">
              Receive an alert when your target rate is available.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}