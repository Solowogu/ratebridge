import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getLemFiQuote(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<ProviderQuote> {
  if (
    !fromCurrency ||
    !toCurrency ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error("Invalid LemFi quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  // Estimated LemFi pricing.
  // Replace with official/live provider data when available.
  const estimatedRate = referenceRate * 0.996;
  const fee = 0;

  return {
    provider: "LemFi",
    rate: estimatedRate,
    fee,
    recipientReceives:
      Math.max(amount - fee, 0) * estimatedRate,
    deliveryTime: "Usually within minutes",
    isLive: false,
    quoteType: "estimated",
  };
}