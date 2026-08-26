import type { ProviderQuote } from "./types";

type WisePaymentOption = {
  disabled?: boolean;
  payIn?: string;
  payOut?: string;
  sourceAmount?: number;
  targetAmount?: number;
  sourceCurrency?: string;
  targetCurrency?: string;
  estimatedDelivery?: string;
  formattedEstimatedDelivery?: string;
  fee?: {
    total?: number;
  };
  price?: {
    total?: {
      value?: {
        amount?: number;
      };
    };
  };
};

type WiseQuoteResponse = {
  rate?: number;
  sourceAmount?: number;
  targetAmount?: number;
  sourceCurrency?: string;
  targetCurrency?: string;
  paymentOptions?: WisePaymentOption[];
  rateTimestamp?: string;
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

  const sourceCurrency =
    fromCurrency.trim().toUpperCase();

  const targetCurrency =
    toCurrency.trim().toUpperCase();

  const response = await fetch(
    "https://api.wise.com/2026Q3/quotes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceCurrency,
        targetCurrency,
        sourceAmount: amount,
      }),
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

    throw new Error(
      "Unable to retrieve a Wise quote."
    );
  }

  const quote =
    (await response.json()) as WiseQuoteResponse;

  if (
    typeof quote.rate !== "number" ||
    !Number.isFinite(quote.rate)
  ) {
    throw new Error(
      "Wise returned an invalid exchange rate."
    );
  }

  const enabledOptions =
    quote.paymentOptions?.filter(
      (option) => !option.disabled
    ) ?? [];

  const preferredOption =
    enabledOptions.find(
      (option) =>
        option.payIn === "BANK_TRANSFER"
    ) ??
    enabledOptions.find(
      (option) =>
        option.payIn === "INTERAC"
    ) ??
    enabledOptions[0];

  if (!preferredOption) {
    throw new Error(
      "Wise returned no available payment options."
    );
  }

  const fee =
    preferredOption.fee?.total ??
    preferredOption.price?.total?.value?.amount ??
    0;

  const recipientReceives =
    typeof preferredOption.targetAmount === "number"
      ? preferredOption.targetAmount
      : Math.max(amount - fee, 0) * quote.rate;

  let deliveryTime =
    "Check Wise for delivery estimate";

  if (
    preferredOption.formattedEstimatedDelivery
  ) {
    deliveryTime =
      preferredOption.formattedEstimatedDelivery;
  } else if (
    preferredOption.estimatedDelivery
  ) {
    const deliveryDate = new Date(
      preferredOption.estimatedDelivery
    );

    if (!Number.isNaN(deliveryDate.getTime())) {
      deliveryTime = `Estimated ${deliveryDate.toLocaleDateString(
        "en-CA",
        {
          month: "short",
          day: "numeric",
        }
      )}`;
    }
  }

  return {
    provider: "Wise",
    rate: quote.rate,
    fee,
    recipientReceives,
    deliveryTime,
    isLive: true,
    quoteType: "live",
    updatedAt:
      quote.rateTimestamp ??
      new Date().toISOString(),
    source: "Wise display quote",
  };
}