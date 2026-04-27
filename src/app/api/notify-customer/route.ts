import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const { email, name, date, timeSlotLabels, price, status } = await req.json() as {
      email: string;
      name: string;
      date: string;
      timeSlotLabels: string[];
      price: number;
      status: "confirmed" | "cancelled";
    };

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass || gmailUser === "your@gmail.com") {
      return NextResponse.json({ ok: false, error: "Gmail not configured" });
    }

    const dateLabel = format(new Date(date + "T00:00:00"), "EEEE, MMMM d, yyyy");
    const slots = timeSlotLabels.join(", ");
    const isConfirmed = status === "confirmed";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0f172a;color:#f1f5f9;margin:0;padding:20px;">
  <div style="max-width:500px;margin:0 auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
    <div style="background:linear-gradient(135deg,${isConfirmed ? "#16a34a,#15803d" : "#dc2626,#b91c1c"});padding:24px 28px;">
      <h1 style="margin:0;font-size:20px;color:white;">
        ${isConfirmed ? "✅ Booking Confirmed!" : "❌ Booking Cancelled"}
      </h1>
      <p style="margin:6px 0 0;color:${isConfirmed ? "#bbf7d0" : "#fecaca"};font-size:14px;">Rally Ranch Pickleball</p>
    </div>
    <div style="padding:28px;">
      <p style="color:#f1f5f9;font-size:15px;margin:0 0 20px;">Hi <strong>${name}</strong>,</p>
      <p style="color:#94a3b8;font-size:14px;margin:0 0 20px;">
        ${isConfirmed
          ? "Your booking has been <strong style='color:#4ade80'>confirmed</strong>! We look forward to seeing you on the court."
          : "Unfortunately, your booking has been <strong style='color:#f87171'>cancelled</strong>. Please contact us if you have questions."}
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="color:#94a3b8;font-size:13px;padding:8px 0;border-bottom:1px solid #334155;width:40%;">📅 Date</td>
          <td style="color:#f1f5f9;font-size:14px;font-weight:600;padding:8px 0;border-bottom:1px solid #334155;">${dateLabel}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;font-size:13px;padding:8px 0;border-bottom:1px solid #334155;">⏰ Time</td>
          <td style="color:#f1f5f9;font-size:14px;padding:8px 0;border-bottom:1px solid #334155;">${slots}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;font-size:13px;padding:8px 0;">💵 Amount</td>
          <td style="color:#4ade80;font-size:18px;font-weight:900;padding:8px 0;">₱${price}</td>
        </tr>
      </table>
      ${isConfirmed ? `
      <div style="margin-top:20px;background:#14532d;border-radius:12px;padding:16px;">
        <p style="margin:0;color:#4ade80;font-size:14px;font-weight:600;">📍 Rally Ranch Pickleball Court</p>
        <p style="margin:6px 0 0;color:#86efac;font-size:13px;">Please arrive on time. Contact us at 0961-812-7180 for any concerns.</p>
      </div>` : `
      <div style="margin-top:20px;background:#450a0a;border-radius:12px;padding:16px;">
        <p style="margin:0;color:#f87171;font-size:14px;font-weight:600;">Need help?</p>
        <p style="margin:6px 0 0;color:#fca5a5;font-size:13px;">Contact us at 0961-812-7180 or message us on Facebook.</p>
      </div>`}
    </div>
  </div>
</body>
</html>`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"Rally Ranch Pickleball" <${gmailUser}>`,
      to: email,
      subject: isConfirmed
        ? `✅ Booking Confirmed — ${dateLabel} · Rally Ranch`
        : `❌ Booking Cancelled — ${dateLabel} · Rally Ranch`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Customer notify error:", err);
    return NextResponse.json({ ok: false, error: "Failed to send email" });
  }
}
