export async function getReferenceRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  const response = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${toCurrency}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to retrieve reference exchange rate.");
  }

  const data = await response.json();

  const rate = data?.rates?.[toCurrency];

  if (typeof rate !== "number") {
    throw new Error("Invalid reference exchange rate.");
  }

  return rate;
}