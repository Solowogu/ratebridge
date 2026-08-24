import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { sql } from "../../../lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type AlertDirection = "above" | "below";

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;
    const { isActive } = await request.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "A valid alert status is required.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedAlerts = await sql`
      UPDATE rate_alerts
      SET
        is_active = ${isActive},
        is_triggered = CASE
          WHEN ${isActive} = TRUE THEN FALSE
          ELSE is_triggered
        END,
        triggered_at = CASE
          WHEN ${isActive} = TRUE THEN NULL
          ELSE triggered_at
        END
      WHERE id = ${id}
        AND user_id = ${session.user.id}
      RETURNING id;
    `;

    if (updatedAlerts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Unable to update rate alert:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update alert.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const deletedAlerts = await sql`
      DELETE FROM rate_alerts
      WHERE id = ${id}
        AND user_id = ${session.user.id}
      RETURNING id;
    `;

    if (deletedAlerts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Unable to delete rate alert:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete alert.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const {
      email,
      targetRate,
      direction,
    } = await request.json();

    const numericTargetRate = Number(targetRate);

    const normalizedDirection: AlertDirection =
      direction === "below" ? "below" : "above";

    if (
      !email?.trim() ||
      !Number.isFinite(numericTargetRate) ||
      numericTargetRate <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid email and target rate are required.",
        },
        {
          status: 400,
        }
      );
    }

    const currentAlert = (await sql`
      SELECT
        from_currency,
        to_currency
      FROM rate_alerts
      WHERE id = ${id}
        AND user_id = ${session.user.id}
      LIMIT 1;
    `) as {
      from_currency: string;
      to_currency: string;
    }[];

    if (currentAlert.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert not found.",
        },
        {
          status: 404,
        }
      );
    }

    const existingAlerts = (await sql`
      SELECT id
      FROM rate_alerts
      WHERE user_id = ${session.user.id}
        AND from_currency =
          ${currentAlert[0].from_currency}
        AND to_currency =
          ${currentAlert[0].to_currency}
        AND target_rate = ${numericTargetRate}
        AND direction = ${normalizedDirection}
        AND is_active = TRUE
        AND is_triggered = FALSE
        AND id <> ${id}
      LIMIT 1;
    `) as { id: string }[];

    if (existingAlerts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You already have an active alert for this currency pair, target rate, and direction.",
        },
        {
          status: 409,
        }
      );
    }

    const updatedAlerts = await sql`
      UPDATE rate_alerts
      SET
        email = ${email.trim()},
        target_rate = ${numericTargetRate},
        direction = ${normalizedDirection}
      WHERE id = ${id}
        AND user_id = ${session.user.id}
      RETURNING id;
    `;

    if (updatedAlerts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Unable to update rate alert:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update alert.",
      },
      {
        status: 500,
      }
    );
  }
}