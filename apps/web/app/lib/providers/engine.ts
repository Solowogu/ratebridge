import { providers } from "../../data/providers";
import { getReferenceRate } from "../exchange-rates";

import { getWiseQuote } from "./wise";
import { getOFXQuote } from "./ofx";
import { getXEQuote } from "./xe";
import { getRemitlyQuote } from "./remitly";
import { getWorldRemitQuote } from "./worldremit";
import { getLemFiQuote } from "./lemfi";
import { getCadRemitQuote } from "./cadremit";

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

  const adapterQuotes: ProviderQuote[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      adapterQuotes.push(result.value);
    } else {
      console.error(
        "Provider adapter failed:",
        result.reason
      );
    }
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  return providers.map((provider) => {
    const adapterQuote = adapterQuotes.find(
      (quote) => quote.provider === provider.name
    );

    if (adapterQuote) {
      return adapterQuote;
    }

    const rate =
      referenceRate * provider.rateMultiplier;

    const fee = provider.fee;

    const recipientReceives =
      Math.max(amount - fee, 0) * rate;

    return {
      provider: provider.name,
      rate,
      fee,
      recipientReceives,
      deliveryTime: provider.deliveryTime,
      isLive: false,
    };
  });
}