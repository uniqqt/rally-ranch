import { NextResponse } from "next/server";

export async function GET() {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set" }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "✅ <b>Rally Ranch Telegram test</b>\n\nNotifications are working!",
      parse_mode: "HTML",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "Telegram API error", details: data }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Telegram message sent!" });
}
