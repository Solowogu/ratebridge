import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error.issues[0]?.message ||
            "Invalid account details.",
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create account with these details. Try logging in or use a different email.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES (
        ${name},
        ${email},
        ${passwordHash}
      );
    `;

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    const databaseError = error as {
      code?: string;
      constraint?: string;
    };

    if (
      databaseError.code === "23505" ||
      databaseError.constraint === "users_email_key"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create account with these details. Try logging in or use a different email.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create account.",
      },
      { status: 500 }
    );
  }
}
