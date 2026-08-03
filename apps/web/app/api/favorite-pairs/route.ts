import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../auth";
import { sql } from "../../lib/db";

type FavoritePair = {
  id: string;
  from_currency: string;
  to_currency: string;
  created_at: string;
};

function isValidCurrency(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[A-Za-z]{3}$/.test(value)
  );
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const favorites = (await sql`
      SELECT
        id,
        from_currency,
        to_currency,
        created_at
      FROM favorite_currency_pairs
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC;
    `) as FavoritePair[];

    return NextResponse.json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error("Unable to load favorite pairs:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load favorite currency pairs.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { fromCurrency, toCurrency } = body;

    if (
      !isValidCurrency(fromCurrency) ||
      !isValidCurrency(toCurrency)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide valid currency codes.",
        },
        { status: 400 }
      );
    }

    const normalizedFrom = fromCurrency.toUpperCase();
    const normalizedTo = toCurrency.toUpperCase();

    if (normalizedFrom === normalizedTo) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select two different currencies.",
        },
        { status: 400 }
      );
    }

    const result = (await sql`
      INSERT INTO favorite_currency_pairs (
        user_id,
        from_currency,
        to_currency
      )
      VALUES (
        ${session.user.id},
        ${normalizedFrom},
        ${normalizedTo}
      )
      ON CONFLICT (
        user_id,
        from_currency,
        to_currency
      )
      DO NOTHING
      RETURNING
        id,
        from_currency,
        to_currency,
        created_at;
    `) as FavoritePair[];

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This currency pair is already a favorite.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        favorite: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unable to save favorite pair:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save the favorite currency pair.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get("id");

    if (!favoriteId) {
      return NextResponse.json(
        {
          success: false,
          error: "Favorite ID is required.",
        },
        { status: 400 }
      );
    }

    const deleted = await sql`
      DELETE FROM favorite_currency_pairs
      WHERE id = ${favoriteId}
        AND user_id = ${session.user.id}
      RETURNING id;
    `;

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Favorite pair was not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Unable to delete favorite pair:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete the favorite currency pair.",
      },
      { status: 500 }
    );
  }
}