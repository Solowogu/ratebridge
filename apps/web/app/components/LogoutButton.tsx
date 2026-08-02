"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:px-4 sm:text-base"
    >
      Log Out
    </button>
  );
}