import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../auth";
import { providers } from "../../data/providers";
import { sql } from "../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    const providerName =
      request.nextUrl.searchParams.get("provider")?.trim() || "";

    const fromCurrency =
      request.nextUrl.searchParams
        .get("from")
        ?.trim()
        .toUpperCase() || "";

    const toCurrency =
      request.nextUrl.searchParams
        .get("to")
        ?.trim()
        .toUpperCase() || "";

    if (
      !providerName ||
      !fromCurrency ||
      !toCurrency ||
      fromCurrency === toCurrency
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid provider visit details.",
        },
        {
          status: 400,
        }
      );
    }

    const provider = providers.find(
      (item) => item.name === providerName
    );

    if (!provider) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider not found.",
        },
        {
          status: 404,
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
        ${provider.name},
        ${fromCurrency},
        ${toCurrency}
      );
    `;

    const destination =
      provider.affiliateUrl?.trim() || provider.website;

    return NextResponse.redirect(destination);
  } catch (error) {
    console.error("Unable to process provider visit:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process provider visit.",
      },
      {
        status: 500,
      }
    );
  }
}