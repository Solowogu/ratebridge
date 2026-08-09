import { getWiseQuote } from "./wise";
import { getOFXQuote } from "./ofx";
import type { ProviderQuote } from "./types";
import { getXEQuote } from "./xe";

type ProviderAdapter = (
  fromCurrency: string,
  toCurrency: string,
  amount: number
) => Promise<ProviderQuote>;

const providerAdapters: ProviderAdapter[] = [
  getWiseQuote,
  getOFXQuote,
  getXEQuote,
];

export async function getProviderQuotes(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<ProviderQuote[]> {
  const results = await Promise.allSettled(
    providerAdapters.map((adapter) =>
      adapter(fromCurrency, toCurrency, amount)
    )
  );

  const quotes: ProviderQuote[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      quotes.push(result.value);
    } else {
      console.error(
        "Provider adapter failed:",
        result.reason
      );
    }
  }

  return quotes;
}