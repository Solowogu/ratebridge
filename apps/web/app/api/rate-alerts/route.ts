import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      fromCurrency,
      toCurrency,
      targetRate,
      currentRate,
    } = await request.json();

    await sql`
      INSERT INTO rate_alerts (
        email,
        from_currency,
        to_currency,
        target_rate,
        current_rate
      )
      VALUES (
        ${email},
        ${fromCurrency},
        ${toCurrency},
        ${targetRate},
        ${currentRate}
      );
    `;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save alert.",
      },
      {
        status: 500,
      }
    );
  }
}