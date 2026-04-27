import { NextResponse } from "next/server";

export async function GET() {
  const token   = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token) return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  if (chatIds.length === 0) return NextResponse.json({ error: "TELEGRAM_CHAT_ID not set" }, { status: 500 });

  const results = await Promise.all(
    chatIds.map(async (chatId) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `✅ <b>Rally Ranch test</b>\nNotification working for chat ID: <code>${chatId}</code>`,
          parse_mode: "HTML",
        }),
      });
      const data = await res.json();
      return { chatId, ok: res.ok, error: res.ok ? null : data?.description };
    })
  );

  return NextResponse.json({ results });
}
