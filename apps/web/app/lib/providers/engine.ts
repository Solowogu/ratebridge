import { getWiseQuote } from "./wise";
import { getOFXQuote } from "./ofx";
import { getXEQuote } from "./xe";
import { getRemitlyQuote } from "./remitly";
import { getWorldRemitQuote } from "./worldremit";
import { getLemFiQuote } from "./lemfi";
import { getCadRemitQuote } from "./cadremit";
import { getCurrencyFairQuote } from "./currencyfair";
import { getMoneyGramQuote } from "./moneygram";
import { getWesternUnionQuote } from "./westernunion";

import type { ProviderQuote } from "./types";

type ProviderAdapter = (
  fromCurrency: string,
  toCurrency: string,
  amount: number
) => Promise<ProviderQuote>;

const providerAdapters: ProviderAdapter[] = [
  getWiseQuote,
  getOFXQuote,
  getXEQuote,
  getRemitlyQuote,
  getWorldRemitQuote,
  getLemFiQuote,
  getCadRemitQuote,
  getCurrencyFairQuote,
  getMoneyGramQuote,
  getWesternUnionQuote,
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