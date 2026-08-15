import type { ProviderQuote } from "./types";

type WiseQuoteRequest = {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
};

type WiseQuoteResponse = {
  rate?: number;
  sourceAmount?: number;
  targetAmount?: number;
  fee?: number;
  paymentOptions?: Array<{
    fee?: {
      total?: number;
    };
    estimatedDelivery?: string;
  }>;
};


export async function getWiseQuote(
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
    throw new Error("Invalid Wise quote request.");
  }

  const requestBody: WiseQuoteRequest = {
    sourceCurrency: fromCurrency.toUpperCase(),
    targetCurrency: toCurrency.toUpperCase(),
    sourceAmount: amount,
  };

  const response = await fetch(
    "https://api.wise.com/v3/quotes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.error(
      "Wise quote request failed:",
      response.status,
      errorBody
    );

    throw new Error("Unable to retrieve a Wise quote.");
  }

  const quote = (await response.json()) as WiseQuoteResponse;

  if (
    typeof quote.rate !== "number" ||
    !Number.isFinite(quote.rate)
  ) {
    throw new Error("Wise returned an invalid exchange rate.");
  }

  const paymentOption = quote.paymentOptions?.[0];

  const fee =
    paymentOption?.fee?.total ??
    quote.fee ??
    0;

  const recipientReceives =
    typeof quote.targetAmount === "number"
      ? quote.targetAmount
      : Math.max(amount - fee, 0) * quote.rate;

  const deliveryTime =
    paymentOption?.estimatedDelivery ??
    "Check Wise for delivery estimate";

  return {
    provider: "Wise",
    rate: quote.rate,
    fee,
    recipientReceives,
    deliveryTime,
    isLive: true,
    quoteType: "live",
  };
}