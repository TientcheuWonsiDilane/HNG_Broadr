import { NextRequest, NextResponse } from "next/server";
import { getMailgunConfig, sendMailgunEmail } from "@/lib/mailgun";

export async function GET() {
  const config = getMailgunConfig();

  return NextResponse.json({
    apiKeyConfigured: Boolean(config.apiKey),
    baseUrl: config.baseUrl,
    sandboxDomain: config.domain,
    fromEmail: config.fromEmail,
    status: "configured",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, text, html, fromName } = body ?? {};

    if (!to || !subject || !text) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: to, subject, and text are required.",
        },
        { status: 400 },
      );
    }

    await sendMailgunEmail({
      to,
      subject,
      text,
      html,
      fromName,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully via Mailgun.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
