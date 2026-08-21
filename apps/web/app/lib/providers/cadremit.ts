import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getCadRemitQuote(
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
    throw new Error("Invalid CadRemit quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  // Estimated CadRemit pricing.
  // Replace with official/live provider data when available.
  const estimatedRate = referenceRate * 0.994;
  const fee = 0;

  return {
  provider: "CadRemit",
  rate: estimatedRate,
  fee,
  recipientReceives:
    Math.max(amount - fee, 0) * estimatedRate,
  deliveryTime: "Instant to 2 days",
  isLive: false,
  quoteType: "estimated",
  updatedAt: new Date().toISOString(),
  source: "RateBridge estimate",
};
}