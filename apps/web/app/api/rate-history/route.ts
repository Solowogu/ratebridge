import { NextResponse } from "next/server";

type HistoricalRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();

  if (
    !from ||
    !to ||
    !/^[A-Z]{3}$/.test(from) ||
    !/^[A-Z]{3}$/.test(to)
  ) {
    return NextResponse.json(
      { error: "Please provide valid from and to currency codes." },
      { status: 400 }
    );
  }

  const endDate = new Date();
  const startDate = new Date();

  // Request extra calendar days so weekends do not leave the chart short.
  startDate.setUTCDate(endDate.getUTCDate() - 10);

  if (from === to) {
    const data = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (6 - index));

      return {
        date: formatDate(date),
        rate: 1,
      };
    });

    return NextResponse.json({
      from,
      to,
      data,
    });
  }

  try {
    const apiUrl = new URL("https://api.frankfurter.dev/v2/rates");

    apiUrl.searchParams.set("from", formatDate(startDate));
    apiUrl.searchParams.set("to", formatDate(endDate));
    apiUrl.searchParams.set("base", from);
    apiUrl.searchParams.set("quotes", to);

    const response = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to retrieve historical exchange rates." },
        { status: response.status }
      );
    }

    const rates = (await response.json()) as HistoricalRate[];

    const data = rates
      .filter(
        (item) =>
          item.base === from &&
          item.quote === to &&
          Number.isFinite(item.rate)
      )
      .slice(-7)
      .map((item) => ({
        date: item.date,
        rate: item.rate,
      }));

    if (data.length === 0) {
      return NextResponse.json(
        { error: `Historical rates are unavailable for ${from} to ${to}.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      from,
      to,
      data,
    });
  } catch {
    return NextResponse.json(
      { error: "The historical-rate service could not be reached." },
      { status: 500 }
    );
  }
}