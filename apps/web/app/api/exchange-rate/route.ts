import { NextResponse } from "next/server";

type ExchangeRateResponse = {
  result: "success" | "error";
  base_code?: string;
  target_code?: string;
  conversion_rate?: number;
  conversion_result?: number;
  "error-type"?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();
  const amount = Number(searchParams.get("amount"));

  if (!from || !to || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      {
        error: "Please provide valid from, to, and amount values.",
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "The exchange-rate API key is not configured.",
      },
      { status: 500 }
    );
  }

  try {
    const apiUrl =
      `https://v6.exchangerate-api.com/v6/${apiKey}` +
      `/pair/${from}/${to}/${amount}`;

    const response = await fetch(apiUrl, {
      cache: "no-store",
    });

    const data = (await response.json()) as ExchangeRateResponse;

    if (!response.ok || data.result !== "success") {
      return NextResponse.json(
        {
          error: data["error-type"] ?? "Unable to retrieve the exchange rate.",
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({
      from: data.base_code,
      to: data.target_code,
      amount,
      rate: data.conversion_rate,
      convertedAmount: data.conversion_result,
    });
  } catch {
    return NextResponse.json(
      {
        error: "The exchange-rate service could not be reached.",
      },
      { status: 500 }
    );
  }
}