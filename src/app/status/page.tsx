"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getBookingById } from "@/lib/bookings";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { Search, CheckCircle2, XCircle, Clock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Verification",
    description: "Your payment is being verified by the court owner. Please wait.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    icon: <Clock className="w-6 h-6" />,
    glow: "shadow-yellow-500/20",
  },
  confirmed: {
    label: "Booking Confirmed!",
    description: "Your booking is confirmed. See you on the court!",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/30",
    icon: <CheckCircle2 className="w-6 h-6" />,
    glow: "shadow-green-500/20",
  },
  cancelled: {
    label: "Booking Cancelled",
    description: "Your booking has been cancelled. Contact us at 0961-812-7180 for assistance.",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    icon: <XCircle className="w-6 h-6" />,
    glow: "shadow-red-500/20",
  },
};

export default function StatusPage() {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState(searchParams.get("id") ?? "");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) { setBookingId(id); handleSearchById(id); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchById = async (id: string) => {
    const clean = id.trim().replace("#", "");
    if (!clean) return;
    setLoading(true);
    setNotFound(false);
    setBooking(null);
    try {
      const result = await getBookingById(clean);
      if (result) { setBooking(result); } else { setNotFound(true); }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => handleSearchById(bookingId);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image src="/logo.png" alt="Rally Ranch" fill className="object-contain rounded-full" />
            </div>
            <span className="text-white font-bold text-base">Rally Ranch</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-12 pb-20">
        <div className="w-full max-w-lg">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-white">Check Booking Status</h1>
            <p className="text-slate-400 mt-2 text-sm">Enter your Booking ID to see if your reservation has been confirmed.</p>
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter Booking ID (e.g. G5CGMQRN)"
                className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !bookingId.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold px-5 rounded-xl transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
            </button>
          </div>

          {/* Not found */}
          {notFound && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center">
              <p className="text-slate-400">No booking found with that ID. Please check and try again.</p>
            </div>
          )}

          {/* Result */}
          {booking && (() => {
            const cfg = STATUS_CONFIG[booking.status];
            return (
              <div className={`bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden shadow-xl ${cfg.glow}`}>
                {/* Status banner */}
                <div className={`border ${cfg.bg} px-6 py-5 flex items-center gap-4`}>
                  <div className={cfg.color}>{cfg.icon}</div>
                  <div>
                    <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{cfg.description}</p>
                  </div>
                </div>

                {/* Booking details */}
                <div className="px-6 py-5 space-y-3">
                  {[
                    { label: "Booking ID", value: `#${booking.id?.slice(0, 8).toUpperCase()}` },
                    { label: "Name", value: booking.name },
                    { label: "Date", value: format(new Date(booking.date + "T00:00:00"), "EEEE, MMMM d, yyyy") },
                    { label: "Time Slot(s)", value: (booking.timeSlotLabels ?? []).join(", ") },
                    { label: "Amount", value: `₱${booking.price}` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <span className="text-slate-400 text-sm">{row.label}</span>
                      <span className="text-white text-sm font-medium text-right max-w-[60%]">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-5">
                  <p className="text-slate-500 text-xs text-center">
                    Questions? Contact us at <span className="text-blue-400">0961-812-7180</span>
                  </p>
                </div>
              </div>
            );
          })()}

          <p className="text-center text-slate-600 text-xs mt-8">
            Your Booking ID was shown on the confirmation screen after booking.
          </p>
        </div>
      </div>
    </div>
  );
}
