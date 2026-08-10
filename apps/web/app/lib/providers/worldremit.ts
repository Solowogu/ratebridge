import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getWorldRemitQuote(
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
    throw new Error("Invalid WorldRemit quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  // Estimated WorldRemit pricing.
  // Replace with official/live provider data when available.
  const estimatedRate = referenceRate * 0.988;
  const fee = 3.49;

  return {
    provider: "WorldRemit",
    rate: estimatedRate,
    fee,
    recipientReceives:
      Math.max(amount - fee, 0) * estimatedRate,
    deliveryTime: "Minutes to 2 days",
    isLive: false,
  };
}