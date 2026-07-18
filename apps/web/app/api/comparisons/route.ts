import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";

type ComparisonRequest = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  referenceRate: number;
  bestProvider: string;
  bestRecipientAmount: number;
};

export async function POST(request: NextRequest) {
  try {
    const body: ComparisonRequest = await request.json();

    const {
      amount,
      fromCurrency,
      toCurrency,
      referenceRate,
      bestProvider,
      bestRecipientAmount,
    } = body;

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !fromCurrency ||
      !toCurrency ||
      !Number.isFinite(referenceRate) ||
      referenceRate <= 0 ||
      !bestProvider ||
      !Number.isFinite(bestRecipientAmount)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid comparison data.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO comparisons (
        amount,
        from_currency,
        to_currency,
        reference_rate,
        best_provider,
        best_recipient_amount
      )
      VALUES (
        ${amount},
        ${fromCurrency.toUpperCase()},
        ${toCurrency.toUpperCase()},
        ${referenceRate},
        ${bestProvider},
        ${bestRecipientAmount}
      )
      RETURNING
        id,
        amount,
        from_currency,
        to_currency,
        reference_rate,
        best_provider,
        best_recipient_amount,
        created_at
    `;

    return NextResponse.json(
      {
        success: true,
        comparison: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save comparison:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save the comparison.",
      },
      { status: 500 }
    );
  }
}