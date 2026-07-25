import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
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
      SET is_active = ${isActive}
      WHERE id = ${id}
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