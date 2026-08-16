type ExchangeRateResponse = {
  result: "success" | "error";
  base_code?: string;
  target_code?: string;
  conversion_rate?: number;
  "error-type"?: string;
};

export async function getReferenceRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) {
    return 1;
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    throw new Error("The exchange-rate API key is not configured.");
  }

  const apiUrl =
    `https://v6.exchangerate-api.com/v6/${apiKey}` +
    `/pair/${from}/${to}`;

  const response = await fetch(apiUrl, {
    cache: "no-store",
  });

  const data = (await response.json()) as ExchangeRateResponse;

  if (!response.ok || data.result !== "success") {
    console.error(
      "Reference exchange-rate request failed:",
      data["error-type"] ?? response.status
    );

    throw new Error("Unable to retrieve reference exchange rate.");
  }

  if (
    typeof data.conversion_rate !== "number" ||
    !Number.isFinite(data.conversion_rate)
  ) {
    throw new Error("Invalid reference exchange rate.");
  }

  return data.conversion_rate;
}