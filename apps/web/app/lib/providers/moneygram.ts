import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getMoneyGramQuote(
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
    throw new Error("Invalid MoneyGram quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  // Estimated MoneyGram pricing.
  // Replace with official/live provider data when available.
  const estimatedRate = referenceRate * 0.982;
  const fee = 4.99;

  return {
  provider: "MoneyGram",
  rate: estimatedRate,
  fee,
  recipientReceives:
    Math.max(amount - fee, 0) * estimatedRate,
  deliveryTime: "Minutes to 2 days",
  isLive: false,
  quoteType: "estimated",
  updatedAt: new Date().toISOString(),
};
}