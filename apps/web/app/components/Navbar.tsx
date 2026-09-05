import Link from "next/link";
import { auth } from "../../auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        {/* Mobile navbar */}
        <div className="flex items-center justify-between sm:hidden">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            RateBridge
          </Link>

          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
              Menu
            </summary>

            <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <Link
                href="/"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                href="/how-we-compare"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                How We Compare
              </Link>

              {session?.user && (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/history"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    History
                  </Link>

                  <Link
                    href="/alerts"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Alerts
                  </Link>
                </>
              )}

              <Link
                href="/about"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                About
              </Link>

              {session?.user ? (
                <div className="mt-2 border-t border-gray-200 pt-2">
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Hi, {session.user.name ?? "User"}
                  </div>

                  <div className="px-4 py-2">
                    <LogoutButton />
                  </div>
                </div>
              ) : (
                <div className="mt-2 border-t border-gray-200 pt-2">
                  <Link
                    href="/login"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="mt-1 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </details>
        </div>

        {/* Desktop navbar */}
        <div className="hidden items-center justify-between sm:flex">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            RateBridge
          </Link>

          <div className="flex items-center justify-end gap-2">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Home
            </Link>

            <Link
              href="/how-we-compare"
              className="rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100"
            >
              How We Compare
            </Link>

            {session?.user && (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Dashboard
                </Link>

                <Link
                  href="/history"
                  className="rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  History
                </Link>

                <Link
                  href="/alerts"
                  className="rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Alerts
                </Link>
              </>
            )}

            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100"
            >
              About
            </Link>

            {session?.user ? (
              <>
                <span className="px-3 py-2 text-base font-medium text-gray-700">
                  Hi, {session.user.name ?? "User"}
                </span>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-base font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}