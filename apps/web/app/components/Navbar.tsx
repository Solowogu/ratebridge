import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-center text-2xl font-bold text-blue-600 sm:text-left"
        >
          RateBridge
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <Link
            href="/history"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base"
          >
            History
          </Link>

          <button className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-4 sm:text-base">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}