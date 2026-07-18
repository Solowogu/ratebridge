import { NextRequest, NextResponse } from "next/server";

type FrankfurterResponse = {
  date: string;
  base: string;
  rates: Record<string, number>;
};

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
    });
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to retrieve the exchange rate." },
        { status: response.status }
      );
    }

    const data: FrankfurterResponse = await response.json();
    const rate = data.rates[to];

    if (!rate) {
      return NextResponse.json(
        { error: `No exchange rate was found for ${from} to ${to}.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      rate,
      base: from,
      target: to,
      date: data.date,
    });
  } catch {
    return NextResponse.json(
      { error: "The exchange-rate service is temporarily unavailable." },
      { status: 500 }
    );
  }
}