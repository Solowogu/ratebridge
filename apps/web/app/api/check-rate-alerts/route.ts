import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { sql } from "../../lib/db";

type AlertDirection = "above" | "below";

type RateAlert = {
  id: string;
  email: string;
  from_currency: string;
  to_currency: string;
  target_rate: string;
  direction: AlertDirection;
};

type RateResponse = {
  rate?: number;
  error?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (
      !process.env.CRON_SECRET ||
      authorization !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const appOrigin =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://www.ratebridgefx.com";

    const alerts = (await sql`
      SELECT
        id,
        email,
        from_currency,
        to_currency,
        target_rate,
        direction
      FROM rate_alerts
      WHERE is_active = TRUE
        AND is_triggered = FALSE
      ORDER BY created_at ASC;
    `) as RateAlert[];

    let checked = 0;
    let triggered = 0;
    const failures: string[] = [];

    for (const alert of alerts) {
      try {
        const rateResponse = await fetch(
          `${appOrigin}/api/rates?from=${encodeURIComponent(
            alert.from_currency
          )}&to=${encodeURIComponent(alert.to_currency)}`,
          {
            cache: "no-store",
          }
        );

        const contentType =
          rateResponse.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const responseText = await rateResponse.text();

          throw new Error(
            `Rate API returned ${rateResponse.status} ${rateResponse.statusText} instead of JSON. Response starts with: ${responseText
              .slice(0, 100)
              .replace(/\s+/g, " ")}`
          );
        }

        const rateData: RateResponse =
          await rateResponse.json();

        if (
          !rateResponse.ok ||
          !Number.isFinite(rateData.rate)
        ) {
          throw new Error(
            rateData.error ||
              "Unable to retrieve the current rate."
          );
        }

        const currentRate = Number(rateData.rate);
        const targetRate = Number(alert.target_rate);

        checked += 1;

        await sql`
          UPDATE rate_alerts
          SET
            current_rate = ${currentRate},
            last_checked_at = NOW()
          WHERE id = ${alert.id};
        `;

        const targetReached =
          alert.direction === "below"
            ? currentRate <= targetRate
            : currentRate >= targetRate;

        if (!targetReached) {
          continue;
        }

        const directionLabel =
          alert.direction === "below"
            ? "fallen to or below"
            : "risen to or above";

        const directionSubject =
          alert.direction === "below"
            ? "fallen to your target"
            : "reached your target";

        const { error } = await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "RateBridge <onboarding@resend.dev>",
          to: [alert.email],
          subject: `Your ${alert.from_currency} → ${alert.to_currency} rate has ${directionSubject}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
              <h1 style="color: #2563eb;">
                Target rate reached
              </h1>

              <p>
                Your RateBridge alert for
                <strong>${alert.from_currency} → ${alert.to_currency}</strong>
                has been triggered.
              </p>

              <p>
                The rate has
                <strong>${directionLabel}</strong>
                your target.
              </p>

              <p>
                <strong>Alert condition:</strong>
                ${
                  alert.direction === "below"
                    ? "Rate falls to"
                    : "Rate rises to"
                }
                ${targetRate.toLocaleString()}
                ${alert.to_currency}
              </p>

              <p>
                <strong>Current rate:</strong>
                ${currentRate.toLocaleString()}
                ${alert.to_currency}
              </p>

              <p>
                Sign in to RateBridge to compare available providers.
              </p>

              <p>
                <a
                  href="${appOrigin}"
                  style="display:inline-block;background:#2563eb;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600;"
                >
                  Compare rates
                </a>
              </p>
            </div>
          `,
        });

        if (error) {
          throw new Error(error.message);
        }

        await sql`
          UPDATE rate_alerts
          SET
            is_triggered = TRUE,
            is_active = FALSE,
            triggered_at = NOW(),
            last_checked_at = NOW(),
            current_rate = ${currentRate}
          WHERE id = ${alert.id}
            AND is_triggered = FALSE;
        `;

        triggered += 1;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown alert-processing error.";

        failures.push(`${alert.id}: ${message}`);

        console.error(
          `Unable to process rate alert ${alert.id}:`,
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      totalAlerts: alerts.length,
      checked,
      triggered,
      failures,
    });
  } catch (error) {
    console.error("Unable to check rate alerts:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to check rate alerts.",
      },
      { status: 500 }
    );
  }
}