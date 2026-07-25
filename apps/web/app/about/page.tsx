import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow">
          <h1 className="text-4xl font-bold text-gray-900">
            About RateBridge
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-700">
            RateBridge is a modern exchange-rate comparison platform
            designed to help users find the best value when sending
            money internationally.
          </p>

          <p className="mt-6 text-gray-600">
            Compare live exchange rates, provider fees,
            delivery times, historical trends, and create
            personalized rate alerts so you never miss the
            best time to transfer money.
          </p>

          <div className="mt-10 rounded-xl bg-blue-50 p-6">
            <h2 className="text-xl font-semibold text-blue-700">
              Our Mission
            </h2>

            <p className="mt-3 text-gray-700">
              To make international money transfers more
              transparent, affordable, and accessible for everyone.
            </p>
          </div>

          <div className="mt-10 rounded-xl bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Features
            </h2>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
              <li>Live exchange rates</li>
              <li>Compare multiple money transfer providers</li>
              <li>7-day exchange rate history</li>
              <li>Provider ratings and delivery times</li>
              <li>Favorite providers</li>
              <li>Rate alerts</li>
              <li>Comparison history</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}