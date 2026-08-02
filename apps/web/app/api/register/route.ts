import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const existingUser = await sql`
      SELECT id
      FROM users
      WHERE email = ${email};
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists.",
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

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create account.",
      },
      { status: 500 }
    );
  }
}