import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getXEQuote(
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
    throw new Error("Invalid XE quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  // Estimated XE pricing
  const estimatedRate = referenceRate * 0.991;
  const fee = 2.99;

  return {
    provider: "Xe Money Transfer",
    rate: estimatedRate,
    fee,
    recipientReceives:
      Math.max(amount - fee, 0) * estimatedRate,
    deliveryTime: "1 to 3 business days",
    isLive: false,
    quoteType: "estimated",
  };
}
