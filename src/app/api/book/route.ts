import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/bookings";
import { Booking } from "@/types/booking";
import { format } from "date-fns";

async function sendTelegram(message: string): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0 || token === "your_bot_token") return;

  await Promise.all(
    chatIds.map(async (chatId) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(`Telegram error for ${chatId}:`, res.status, body);
      }
    })
  );
}

function buildTelegramMessage(
  booking: Omit<Booking, "id" | "createdAt">,
  bookingId: string
): string {
  const dateLabel = format(new Date(booking.date + "T00:00:00"), "EEEE, MMM d, yyyy");
  const slots     = booking.timeSlotLabels.join(", ");
  const id        = bookingId.slice(0, 8).toUpperCase();

  return (
    `🏓 <b>New Booking — Rally Ranch</b>\n\n` +
    `🆔 <code>#${id}</code>\n` +
    `👤 <b>${booking.name}</b>\n` +
    `📞 ${booking.phone}\n` +
    (booking.email ? `📧 ${booking.email}\n` : "") +
    `📅 ${dateLabel}\n` +
    `⏰ ${slots}\n` +
    `💵 <b>₱${booking.price}</b>\n` +
    (booking.notes ? `📝 ${booking.notes}\n` : "") +
    (booking.proofUrl ? `\n📷 <a href="${booking.proofUrl}">View GCash Screenshot</a>\n` : "") +
    `\n⚠️ Verify GCash payment, then confirm in admin panel.`
  );
}

export async function POST(req: NextRequest) {
  try {
    const { booking, proofUrl } = await req.json() as {
      booking: Omit<Booking, "id" | "createdAt">;
      proofUrl?: string;
    };

    const bookingId = await createBooking({ ...booking, proofUrl });

    const message = buildTelegramMessage({ ...booking, proofUrl }, bookingId);
    await sendTelegram(message);

    return NextResponse.json({ id: bookingId });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
