import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "RateBridge <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "RateBridge email test",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1>RateBridge email is connected</h1>
          <p>Your Resend integration is working successfully.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend test email error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });
  } catch (error) {
    console.error("Unable to send test email:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to send the test email.",
      },
      { status: 500 }
    );
  }
}