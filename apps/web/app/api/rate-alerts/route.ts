import { auth } from "../../../auth";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to create an alert.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      fromCurrency,
      toCurrency,
      targetRate,
      currentRate,
    } = await request.json();

    const email = session.user.email;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Your account does not have an email address.",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedFrom = String(fromCurrency).toUpperCase();
    const normalizedTo = String(toCurrency).toUpperCase();

    const numericTargetRate = Number(targetRate);
    const numericCurrentRate = Number(currentRate);

    if (
      normalizedFrom === normalizedTo ||
      !Number.isFinite(numericTargetRate) ||
      numericTargetRate <= 0 ||
      !Number.isFinite(numericCurrentRate) ||
      numericCurrentRate <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid alert details.",
        },
        {
          status: 400,
        }
      );
    }

    const existingAlerts = (await sql`
      SELECT id
      FROM rate_alerts
      WHERE user_id = ${session.user.id}
        AND from_currency = ${normalizedFrom}
        AND to_currency = ${normalizedTo}
        AND target_rate = ${numericTargetRate}
        AND is_active = TRUE
        AND is_triggered = FALSE
      LIMIT 1;
    `) as { id: string }[];

    if (existingAlerts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You already have an active alert for this currency pair and target rate.",
        },
        {
          status: 409,
        }
      );
    }

    await sql`
      INSERT INTO rate_alerts (
        user_id,
        email,
        from_currency,
        to_currency,
        target_rate,
        current_rate
      )
      VALUES (
        ${session.user.id},
        ${email},
        ${normalizedFrom},
        ${normalizedTo},
        ${numericTargetRate},
        ${numericCurrentRate}
      );
    `;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Unable to create rate alert:", error);

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