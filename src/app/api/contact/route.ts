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
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;
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

  const hasTelegram = Boolean(telegramToken && telegramChatId);
  const canEmailCompany = Boolean(resendKey && notifyEmail);
  const isProd = process.env.NODE_ENV === "production";

  if (!hasTelegram && !canEmailCompany) {
    if (isProd) {
      return NextResponse.json(
        {
          error:
            "Contact delivery is not configured yet. Please call +251 91 012 7252.",
        },
        { status: 503 },
      );
    }
    console.info("[contact] Dev fallback — message received:\n", text);
    return NextResponse.json({ ok: true, warnings: ["dev-fallback"] });
  }

  const errors: string[] = [];
  let companyNotified = false;

  if (hasTelegram) {
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
      } else {
        companyNotified = true;
      }
    } catch {
      errors.push("Telegram notification failed");
    }
  }

  if (resendKey) {
    const resend = new Resend(resendKey);

    if (canEmailCompany && (!hasTelegram || !companyNotified)) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: notifyEmail!,
          replyTo: email,
          subject: `New enquiry from ${name}`,
          text,
        });
        companyNotified = true;
      } catch {
        errors.push("Company email notification failed");
      }
    }

    try {
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

  if (!companyNotified && isProd) {
    return NextResponse.json(
      { error: "Could not deliver your message. Please call us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, warnings: errors });
}
