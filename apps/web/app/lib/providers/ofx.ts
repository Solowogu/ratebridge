import type { ProviderQuote } from "./types";
import { getReferenceRate } from "../exchange-rates";

export async function getOFXQuote(
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
    throw new Error("Invalid OFX quote request.");
  }

  const referenceRate = await getReferenceRate(
    fromCurrency.toUpperCase(),
    toCurrency.toUpperCase()
  );

  const estimatedRate = referenceRate * 0.993;
  const fee = 0;

  return {
    provider: "OFX",
    rate: estimatedRate,
    fee,
    recipientReceives: amount * estimatedRate,
    deliveryTime: "1 to 3 business days",
    isLive: false,
    quoteType: "estimated",
  };
}