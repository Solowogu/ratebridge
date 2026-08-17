import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getWesternUnionQuote(
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
    throw new Error("Invalid Western Union quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  // Estimated Western Union pricing.
  // Replace with official/live provider data when available.
  const estimatedRate = referenceRate * 0.98;
  const fee = 0;

  return {
  provider: "Western Union",
  rate: estimatedRate,
  fee,
  recipientReceives:
    Math.max(amount - fee, 0) * estimatedRate,
  deliveryTime: "Minutes to 3 days",
  isLive: false,
  quoteType: "estimated",
  updatedAt: new Date().toISOString(),
};
}