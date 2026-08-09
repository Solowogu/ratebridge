import { NextRequest, NextResponse } from "next/server";

import { getWiseQuote } from "../../../lib/providers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fromCurrency,
      toCurrency,
      amount,
    } = body;

    if (
      typeof fromCurrency !== "string" ||
      typeof toCurrency !== "string" ||
      typeof amount !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide fromCurrency, toCurrency and amount.",
        },
        {
          status: 400,
        }
      );
    }

    const quote = await getWiseQuote(
      fromCurrency,
      toCurrency,
      amount
    );

    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("Wise provider API:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve Wise quote.",
      },
      {
        status: 500,
      }
    );
  }
}