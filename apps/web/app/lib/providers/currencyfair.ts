import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getCurrencyFairQuote(
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
    throw new Error("Invalid CurrencyFair quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  // Estimated CurrencyFair pricing.
  // Replace with official/live provider data when available.
  const estimatedRate = referenceRate * 0.989;
  const fee = 4;

  return {
  provider: "CurrencyFair",
  rate: estimatedRate,
  fee,
  recipientReceives:
    Math.max(amount - fee, 0) * estimatedRate,
  deliveryTime: "1 to 3 business days",
  isLive: false,
  quoteType: "estimated",
  updatedAt: new Date().toISOString(),
  source: "RateBridge estimate",
};
}