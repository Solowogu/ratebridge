"use client";

import { trackProviderVisit } from "../lib/analytics";

type ProviderVisitLinkProps = {
  href: string;
  providerName: string;
  fromCurrency?: string;
  toCurrency?: string;
};

export default function ProviderVisitLink({
  href,
  providerName,
  fromCurrency,
  toCurrency,
}: ProviderVisitLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackProviderVisit({
          providerName,
          fromCurrency,
          toCurrency,
        })
      }
      className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
    >
      Visit {providerName}
    </a>
  );
}
