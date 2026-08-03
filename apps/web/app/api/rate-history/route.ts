import { NextResponse } from "next/server";

type HistoricalRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

const supportedRanges = {
  "7D": {
    calendarDays: 12,
    maximumPoints: 7,
    group: null,
  },
  "30D": {
    calendarDays: 45,
    maximumPoints: 8,
    group: "week",
  },
  "90D": {
    calendarDays: 125,
    maximumPoints: 18,
    group: "week",
  },
  "1Y": {
    calendarDays: 380,
    maximumPoints: 13,
    group: "month",
  },
} as const;

type RangeKey = keyof typeof supportedRanges;

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isRangeKey(value: string): value is RangeKey {
  return value in supportedRanges;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();
  const requestedRange =
    searchParams.get("range")?.toUpperCase() ?? "7D";

  if (
    !from ||
    !to ||
    !/^[A-Z]{3}$/.test(from) ||
    !/^[A-Z]{3}$/.test(to)
  ) {
    return NextResponse.json(
      {
        error: "Please provide valid from and to currency codes.",
      },
      {
        status: 400,
      }
    );
  }

  if (!isRangeKey(requestedRange)) {
    return NextResponse.json(
      {
        error: "Range must be 7D, 30D, 90D, or 1Y.",
      },
      {
        status: 400,
      }
    );
  }

  const rangeSettings = supportedRanges[requestedRange];

  const endDate = new Date();
  const startDate = new Date();

  startDate.setUTCDate(
    endDate.getUTCDate() - rangeSettings.calendarDays
  );

  if (from === to) {
    const data = Array.from(
      {
        length: rangeSettings.maximumPoints,
      },
      (_, index) => {
        const date = new Date();

        date.setUTCDate(
          date.getUTCDate() -
            (rangeSettings.maximumPoints - 1 - index)
        );

        return {
          date: formatDate(date),
          rate: 1,
        };
      }
    );

    return NextResponse.json({
      from,
      to,
      range: requestedRange,
      data,
    });
  }

  try {
    const apiUrl = new URL(
      "https://api.frankfurter.dev/v2/rates"
    );

    apiUrl.searchParams.set(
      "from",
      formatDate(startDate)
    );
    apiUrl.searchParams.set(
      "to",
      formatDate(endDate)
    );
    apiUrl.searchParams.set("base", from);
    apiUrl.searchParams.set("quotes", to);

    if (rangeSettings.group) {
  apiUrl.searchParams.set(
    "group",
    rangeSettings.group
  );
}

    const response = await fetch(apiUrl, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
  const errorBody = await response.text();

  console.error(
    "Frankfurter historical-rate error:",
    response.status,
    errorBody
  );

  return NextResponse.json(
    {
      error:
        "Unable to retrieve historical exchange rates.",
    },
    {
      status: response.status,
    }
  );
}

    const rates =
      (await response.json()) as HistoricalRate[];

    const data = rates
      .filter(
        (item) =>
          item.base === from &&
          item.quote === to &&
          Number.isFinite(item.rate)
      )
      .slice(-rangeSettings.maximumPoints)
      .map((item) => ({
        date: item.date,
        rate: item.rate,
      }));

    if (data.length === 0) {
      return NextResponse.json(
        {
          error: `Historical rates are unavailable for ${from} to ${to}.`,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      from,
      to,
      range: requestedRange,
      data,
    });
  } catch (error) {
    console.error(
      "Unable to retrieve historical rates:",
      error
    );

    return NextResponse.json(
      {
        error:
          "The historical-rate service could not be reached.",
      },
      {
        status: 500,
      }
    );
  }
}