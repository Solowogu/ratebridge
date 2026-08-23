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

type ProviderAdapter = {
  name: string;
  getQuote: (
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ) => Promise<ProviderQuote>;
};
const providerAdapters: ProviderAdapter[] = [
  { name: "Wise", getQuote: getWiseQuote },
  { name: "OFX", getQuote: getOFXQuote },
  { name: "XE", getQuote: getXEQuote },
  { name: "Remitly", getQuote: getRemitlyQuote },
  { name: "WorldRemit", getQuote: getWorldRemitQuote },
  { name: "LemFi", getQuote: getLemFiQuote },
  { name: "CadRemit", getQuote: getCadRemitQuote },
  {
    name: "CurrencyFair",
    getQuote: getCurrencyFairQuote,
  },
  { name: "MoneyGram", getQuote: getMoneyGramQuote },
  {
    name: "Western Union",
    getQuote: getWesternUnionQuote,
  },
];

export async function getProviderQuotes(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<{
  quotes: ProviderQuote[];
  unavailableProviders: string[];
}> {
  const results = await Promise.allSettled(
   providerAdapters.map((adapter) =>
  adapter.getQuote(fromCurrency, toCurrency, amount)
)
  );

  const quotes: ProviderQuote[] = [];
  const unavailableProviders: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      quotes.push(result.value);
    } else {
      const providerName = providerAdapters[index].name;
      unavailableProviders.push(providerName);

      console.error(
        "Provider adapter failed:",
        providerName,
        result.reason
      );
    }
  });

  return {
    quotes,
    unavailableProviders,
  };
}