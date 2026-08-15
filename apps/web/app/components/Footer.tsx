import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} RateBridge. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/affiliate-disclosure"
            className="hover:text-blue-600"
          >
            Affiliate Disclosure
          </Link>

          <Link
            href="/about"
            className="hover:text-blue-600"
          >
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}