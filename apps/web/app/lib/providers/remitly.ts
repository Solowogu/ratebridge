import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getRemitlyQuote(
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
    throw new Error("Invalid Remitly quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  const estimatedRate = referenceRate * 0.99;
  const fee = 3.99;

  return {
    provider: "Remitly",
    rate: estimatedRate,
    fee,
    recipientReceives:
      Math.max(amount - fee, 0) * estimatedRate,
    deliveryTime: "Minutes to 2 days",
    isLive: false,
  };
}