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