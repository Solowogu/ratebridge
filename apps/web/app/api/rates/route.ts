import { NextRequest, NextResponse } from "next/server";

type FrankfurterRateResponse = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

type RateResult = {
  rate: number;
  date: string;
};

async function fetchRate(
  from: string,
  to: string,
  provider?: string
): Promise<RateResult> {
  const providerQuery = provider
    ? `?providers=${encodeURIComponent(provider)}`
    : "";

  const response = await fetch(
    `https://api.frankfurter.dev/v2/rate/${from}/${to}${providerQuery}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to retrieve the ${from} to ${to} rate.`);
  }

  const data: FrankfurterRateResponse = await response.json();

  if (typeof data.rate !== "number") {
    throw new Error(`No rate was found for ${from} to ${to}.`);
  }

  return {
    rate: data.rate,
    date: data.date,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();

  if (!from || !to) {
    return NextResponse.json(
      { error: "Both from and to currencies are required." },
      { status: 400 }
    );
  }

  if (from === to) {
    return NextResponse.json({
      rate: 1,
      base: from,
      target: to,
      date: new Date().toISOString().split("T")[0],
      source: "Same currency",
    });
  }

  try {
    let result: RateResult;
    let source = "Frankfurter";

    /*
     * NGN pairs are calculated through USD because the CBN
     * provides USD/NGN but may not provide every direct pair.
     */
    if (to === "NGN") {
      const usdToNgn = await fetchRate("USD", "NGN", "CBN");

      if (from === "USD") {
        result = usdToNgn;
      } else {
        const fromToUsd = await fetchRate(from, "USD");

        result = {
          rate: fromToUsd.rate * usdToNgn.rate,
          date: usdToNgn.date,
        };
      }

      source = "Frankfurter and Central Bank of Nigeria";
    } else if (from === "NGN") {
      const usdToNgn = await fetchRate("USD", "NGN", "CBN");

      if (to === "USD") {
        result = {
          rate: 1 / usdToNgn.rate,
          date: usdToNgn.date,
        };
      } else {
        const usdToTarget = await fetchRate("USD", to);

        result = {
          rate: (1 / usdToNgn.rate) * usdToTarget.rate,
          date: usdToNgn.date,
        };
      }

      source = "Frankfurter and Central Bank of Nigeria";
    } else {
      result = await fetchRate(from, to);
    }

    return NextResponse.json({
      rate: result.rate,
      base: from,
      target: to,
      date: result.date,
      source,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : `Unable to retrieve the ${from} to ${to} exchange rate.`,
      },
      { status: 500 }
    );
  }
}