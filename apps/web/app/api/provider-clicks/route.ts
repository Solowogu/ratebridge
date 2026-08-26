import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../auth";
import { sql } from "../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    const {
      providerName,
      fromCurrency,
      toCurrency,
    } = await request.json();

    const normalizedProviderName =
      String(providerName || "").trim();

    const normalizedFrom =
      String(fromCurrency || "").trim().toUpperCase();

    const normalizedTo =
      String(toCurrency || "").trim().toUpperCase();

    if (
      !normalizedProviderName ||
      !normalizedFrom ||
      !normalizedTo ||
      normalizedFrom === normalizedTo
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid provider click details.",
        },
        {
          status: 400,
        }
      );
    }

    await sql`
      INSERT INTO provider_clicks (
        user_id,
        provider_name,
        from_currency,
        to_currency
      )
      VALUES (
        ${session?.user?.id ?? null},
        ${normalizedProviderName},
        ${normalizedFrom},
        ${normalizedTo}
      );
    `;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Unable to save provider click:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to record provider click.",
      },
      {
        status: 500,
      }
    );
  }
}