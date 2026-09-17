import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "Taologos <onboarding@resend.dev>";

  const text = [
    "New Taologos website enquiry",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const errors: string[] = [];

  if (telegramToken && telegramChatId) {
    try {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text,
          }),
        },
      );
      if (!tgRes.ok) {
        errors.push("Telegram notification failed");
      }
    } catch {
      errors.push("Telegram notification failed");
    }
  } else if (process.env.NODE_ENV === "production") {
    // In production without Telegram, still allow thank-you email if configured;
    // otherwise surface a setup error so leads aren't silently dropped.
    if (!resendKey) {
      return NextResponse.json(
        {
          error:
            "Contact delivery is not configured yet. Please call +251 91 012 7252.",
        },
        { status: 503 },
      );
    }
  } else {
    console.info("[contact] Dev fallback — message received:\n", text);
  }

  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "We received your message — Taologos",
        text: `Hi ${name},\n\nThank you for contacting Taologos General Contractor. We received your message and will follow up soon.\n\nIf it's urgent, call +251 91 012 7252.\n\n— Taologos`,
      });
    } catch {
      errors.push("Thank-you email failed");
    }
  }

  if (
    errors.includes("Telegram notification failed") &&
    !resendKey &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json(
      { error: "Could not deliver your message. Please call us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, warnings: errors });
}
