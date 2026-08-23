import { NextRequest, NextResponse } from "next/server";

import { getProviderQuotes } from "../../lib/providers";

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
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide valid fromCurrency, toCurrency, and amount.",
        },
        { status: 400 }
      );
    }

            const {
      quotes,
      unavailableProviders,
    } = await getProviderQuotes(
      fromCurrency,
      toCurrency,
      amount
    );

    return NextResponse.json({
      success: true,
      quotes,
      unavailableProviders,
    });
  } catch (error) {
    console.error("Provider quote engine failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve provider quotes.",
      },
      { status: 500 }
    );
  }
}