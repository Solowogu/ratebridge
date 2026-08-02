import Link from "next/link";
import { auth } from "../../auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await auth();

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
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base"
          >
            Home
          </Link>

          {session?.user && (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base"
              >
                Dashboard
              </Link>

              <Link
                href="/history"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base"
              >
                History
              </Link>

              <Link
                href="/alerts"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base"
              >
                Alerts
              </Link>
            </>
          )}

          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base"
          >
            About
          </Link>

          {session?.user ? (
            <>
              <span className="px-3 py-2 text-sm font-medium text-gray-700 sm:text-base">
                Hi, {session.user.name ?? "User"}
              </span>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-base"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-4 sm:text-base"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}