"use client";

import { useState, useEffect, useCallback } from "react";
import { format, isPast, startOfDay } from "date-fns";
import Image from "next/image";
import {
  ChevronLeft, ChevronRight, Calendar, User, Phone, Mail,
  MessageSquare, CheckCircle2, Loader2, Clock, Upload, X,
} from "lucide-react";
import { ALL_SLOTS, getSlotsForDate, getOpenHoursLabel } from "@/lib/slots";
import { getBookedSlots } from "@/lib/bookings";
import { uploadProof, isCloudinaryConfigured } from "@/lib/cloudinary";
import toast from "react-hot-toast";

const GCASH_NUMBER = "0961-812-7180";
const GCASH_NAME   = "Manuel Carlos Abanes";

type Step = "datetime" | "details" | "payment" | "confirmed";

interface ConfirmedBooking {
  id: string;
  name: string;
  date: string;
  timeSlotLabels: string[];
  price: number;
}

export default function BookingSection() {
  const [step, setStep]                   = useState<Step>("datetime");
  const [selectedDate, setSelectedDate]   = useState<Date | null>(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots]     = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots]   = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [submitStatus, setSubmitStatus]   = useState("");
  const [confirmed, setConfirmed]         = useState<ConfirmedBooking | null>(null);
  const [proofFile, setProofFile]         = useState<File | null>(null);
  const [proofPreview, setProofPreview]   = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });

  // ── Calendar helpers ──────────────────────────────────────
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const lastDay  = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const startPad = firstDay.getDay();
  const days: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) =>
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i + 1)
    ),
  ];

  // ── Slot availability ─────────────────────────────────────
  const fetchBookedSlots = useCallback(async (date: Date) => {
    setLoadingSlots(true);
    try {
      const slots = await getBookedSlots(format(date, "yyyy-MM-dd"));
      setBookedSlots(slots);
    } catch {
      toast.error("Failed to load availability. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) fetchBookedSlots(selectedDate);
  }, [selectedDate, fetchBookedSlots]);

  // ── Derived values ────────────────────────────────────────
  const selectedSlots = ALL_SLOTS.filter((s) => selectedSlotIds.includes(s.id));
  const totalPrice    = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  const toggleSlot = (id: string) =>
    setSelectedSlotIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (file: File) => {
    if (!selectedDate || selectedSlotIds.length === 0) return;

    setSubmitting(true);
    try {
      let proofUrl: string | undefined;
      if (isCloudinaryConfigured()) {
        setSubmitStatus("Uploading payment screenshot…");
        proofUrl = await uploadProof(file);
      }

      setSubmitStatus("Confirming your booking…");
      const booking = {
        date:           format(selectedDate, "yyyy-MM-dd"),
        timeSlotIds:    selectedSlotIds,
        timeSlotLabels: selectedSlots.map((s) => s.label),
        price:          totalPrice,
        name:           form.name.trim(),
        phone:          form.phone.trim(),
        email:          form.email.trim() || undefined,
        status:         "pending" as const,
        notes:          form.notes.trim() || undefined,
      };

      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking, proofUrl }),
      });
      if (!res.ok) throw new Error("Booking API failed");
      const { id } = await res.json();

      setConfirmed({
        id,
        name:           form.name,
        date:           format(selectedDate, "MMMM d, yyyy"),
        timeSlotLabels: selectedSlots.map((s) => s.label),
        price:          totalPrice,
      });
      setStep("confirmed");
    } catch {
      toast.error("Booking failed. Please try again.");
      setProofFile(null);
      setProofPreview(null);
    } finally {
      setSubmitting(false);
      setSubmitStatus("");
    }
  };

  // ── Proof upload — auto-submits on selection ──────────────
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file."); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("File must be under 5MB.");        return; }
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
    handleSubmit(file);
  };

  const resetBooking = () => {
    setStep("datetime");
    setSelectedDate(null);
    setSelectedSlotIds([]);
    setBookedSlots([]);
    setConfirmed(null);
    setProofFile(null);
    setProofPreview(null);
    setForm({ name: "", phone: "", email: "", notes: "" });
  };

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const STEPS    = ["datetime", "details", "payment"] as Step[];

  return (
    <section id="booking" className="py-24 bg-slate-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Reserve</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">
            Book Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Court Session
            </span>
          </h2>
          <p className="text-slate-400 mt-3">Select a date and one or more time slots.</p>
        </div>

        {/* Step indicator */}
        {step !== "confirmed" && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s === step
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : STEPS.indexOf(step) > i
                    ? "bg-green-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}>
                  {STEPS.indexOf(step) > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${s === step ? "text-white" : "text-slate-500"}`}>
                  {s === "datetime" ? "Date & Time" : s === "details" ? "Your Details" : "Payment"}
                </span>
                {i < 2 && <div className="w-8 h-px bg-slate-700 mx-1" />}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto">

          {/* ── STEP 1: Date & Time ── */}
          {step === "datetime" && (
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 sm:p-8 backdrop-blur-sm">

              {/* Calendar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" /> Select Date
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-white font-medium text-sm min-w-[120px] text-center">
                      {format(calendarMonth, "MMMM yyyy")}
                    </span>
                    <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center text-slate-500 text-xs font-semibold py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, idx) => {
                    if (!day) return <div key={`pad-${idx}`} />;
                    const isSelected = selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                    const isDisabled = isPast(day) && !isToday(day);
                    const isTdy     = isToday(day);
                    return (
                      <button key={day.toISOString()} disabled={isDisabled}
                        onClick={() => { setSelectedDate(day); setSelectedSlotIds([]); }}
                        className={`aspect-square rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-center
                          ${isDisabled ? "text-slate-700 cursor-not-allowed" : "hover:bg-slate-700 cursor-pointer"}
                          ${isSelected ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110" : ""}
                          ${isTdy && !isSelected ? "ring-1 ring-blue-500 text-blue-400" : !isSelected ? "text-slate-300" : ""}
                        `}>
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Available Slots —{" "}
                        <span className="text-blue-400">{format(selectedDate, "MMMM d, yyyy")}</span>
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">{getOpenHoursLabel(selectedDate)} · Select one or more</p>
                    </div>
                    {selectedSlotIds.length > 0 && (
                      <div className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/40 rounded-full px-4 py-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-purple-300 text-sm font-semibold">
                          {selectedSlotIds.length} slot{selectedSlotIds.length > 1 ? "s" : ""} · ₱{totalPrice}
                        </span>
                      </div>
                    )}
                  </div>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8 text-slate-400 gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" /> Checking availability…
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getSlotsForDate(selectedDate).map((slot) => {
                        const booked   = bookedSlots.includes(slot.id);
                        const selected = selectedSlotIds.includes(slot.id);
                        return (
                          <button key={slot.id} disabled={booked} onClick={() => toggleSlot(slot.id)}
                            className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                              ${booked    ? "bg-slate-800/30 border-slate-700/30 cursor-not-allowed opacity-50" : ""}
                              ${selected  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20" : ""}
                              ${!booked && !selected ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-500 hover:bg-slate-800" : ""}
                            `}>
                            <div className="text-left">
                              <div className={`font-semibold text-sm ${selected ? "text-white" : "text-slate-200"}`}>
                                {slot.label}
                              </div>
                              <div className={`text-xs mt-0.5 ${slot.price === 150 ? "text-cyan-400" : "text-purple-400"}`}>
                                {slot.price === 150 ? "Afternoon Rate" : "Evening Rate"}
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              {booked ? (
                                <span className="text-xs text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded-full">Booked</span>
                              ) : (
                                <>
                                  <div className={`font-bold text-lg ${selected ? "text-white" : "text-slate-200"}`}>
                                    ₱{slot.price}
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    selected ? "bg-purple-500 border-purple-500" : "border-slate-500"
                                  }`}>
                                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                  </div>
                                </>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Total + CTA */}
              {selectedSlotIds.length > 0 && (
                <div className="mt-6 bg-slate-900/80 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Total</p>
                    <p className="text-white font-extrabold text-2xl">₱{totalPrice}</p>
                  </div>
                  <p className="text-slate-500 text-xs text-right">
                    {selectedSlotIds.length} slot{selectedSlotIds.length > 1 ? "s" : ""}<br />
                    {selectedSlots.map((s) => s.label).join(", ")}
                  </p>
                </div>
              )}

              <button disabled={!selectedDate || selectedSlotIds.length === 0}
                onClick={() => setStep("details")}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/30">
                Continue to Details →
              </button>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === "details" && (
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 sm:p-8 backdrop-blur-sm">

              {/* Booking summary */}
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4 mb-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Your Booking</p>
                    <p className="text-white font-semibold">
                      {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedSlots.map((s) => (
                        <span key={s.id} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-slate-400 text-xs">Total</p>
                    <p className="text-2xl font-extrabold text-white">₱{totalPrice}</p>
                    <p className="text-slate-500 text-xs">{selectedSlotIds.length} slot{selectedSlotIds.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" /> Your Details
              </h3>

              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name", type: "text", icon: <User className="w-4 h-4" />, placeholder: "Juan dela Cruz", required: true },
                  { label: "Phone Number", key: "phone", type: "tel", icon: <Phone className="w-4 h-4" />, placeholder: "09XX XXX XXXX", required: true },
                  { label: "Email Address", key: "email", type: "email", icon: <Mail className="w-4 h-4" />, placeholder: "juan@email.com", required: false },
                ].map(({ label, key, type, icon, placeholder, required }) => (
                  <div key={key}>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      {label} {required ? <span className="text-red-400">*</span> : <span className="text-slate-500 text-xs">(optional)</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
                      <input type={type} value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors" />
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Notes <span className="text-slate-500 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any special requests or notes…" rows={3}
                      className="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep("datetime")}
                  className="flex-1 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold py-3 rounded-xl transition-colors">
                  ← Back
                </button>
                <button disabled={!form.name.trim() || !form.phone.trim()} onClick={() => setStep("payment")}
                  className="flex-grow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200">
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Payment ── */}
          {step === "payment" && (
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 sm:p-8 backdrop-blur-sm">

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4 mb-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Booking Summary</p>
                    <p className="text-white font-semibold">{form.name}</p>
                    <p className="text-slate-300 text-sm">{selectedDate && format(selectedDate, "MMMM d, yyyy")}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedSlots.map((s) => (
                        <span key={s.id} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-slate-400 text-xs">Amount Due</p>
                    <p className="text-3xl font-extrabold text-white">₱{totalPrice}</p>
                  </div>
                </div>
              </div>

              {/* GCash QR — large and easy to scan */}
              <div className="text-center mb-8">
                <h3 className="text-white font-bold text-xl mb-2">Pay via GCash</h3>
                <p className="text-slate-400 text-sm mb-5">Scan the QR code below or send to the number shown.</p>

                <div className="inline-block bg-white p-5 rounded-3xl shadow-2xl shadow-blue-500/20 mb-5">
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden">
                    <Image src="/gcash-qr.png" alt="GCash QR Code" fill className="object-contain" />
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-4 text-center max-w-xs mx-auto mb-3">
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">GCash Account</p>
                  <p className="text-white font-bold text-lg">{GCASH_NAME}</p>
                  <p className="text-blue-400 font-mono font-bold text-2xl tracking-widest mt-1">{GCASH_NUMBER}</p>
                </div>

                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
                  <span className="text-amber-400 text-xs font-semibold">
                    Send exactly <strong className="text-amber-300">₱{totalPrice}</strong> — include your name in the GCash note
                  </span>
                </div>
              </div>

              {/* Proof of payment upload */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  Upload GCash Screenshot <span className="text-red-400">*</span>
                </h4>
                <p className="text-slate-400 text-xs mb-4">
                  Take a screenshot of your GCash receipt and upload it here. Your slot is confirmed once we verify payment.
                </p>

                {submitting ? (
                  <div className="rounded-xl border border-blue-500/30 bg-slate-900/50 p-8 flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <p className="text-blue-300 text-sm font-medium">{submitStatus || "Processing…"}</p>
                  </div>
                ) : proofPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-green-500/30 bg-slate-900/50">
                    <img src={proofPreview} alt="Proof of payment" className="w-full max-h-64 object-contain" />
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/10 border-t border-green-500/20 px-3 py-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-xs font-medium">{proofFile?.name}</span>
                    </div>
                  </div>
                ) : (
                  <label className="block cursor-pointer border-2 border-dashed border-slate-600 hover:border-blue-500/50 rounded-xl p-8 text-center transition-colors group">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mx-auto mb-3 transition-colors" />
                    <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">Click to upload GCash screenshot</p>
                    <p className="text-slate-600 text-xs mt-1">PNG, JPG up to 5MB</p>
                    <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                  </label>
                )}
              </div>

              {!submitting && (
                <div className="mt-6">
                  <button onClick={() => setStep("details")}
                    className="w-full border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold py-3 rounded-xl transition-colors">
                    ← Back
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Confirmation ── */}
          {step === "confirmed" && confirmed && (
            <div className="bg-slate-800/60 rounded-2xl border border-green-500/30 p-6 sm:p-10 backdrop-blur-sm text-center">
              <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-2">Booking Received!</h3>
              <p className="text-slate-400 mb-8">
                Your reservation has been submitted. We&apos;ll confirm once payment is verified.
              </p>

              <div className="bg-slate-900/80 rounded-xl p-6 text-left mb-8 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Booking ID</span>
                  <span className="text-white text-sm font-mono font-bold">#{confirmed.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="h-px bg-slate-700" />
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Name</span>
                  <span className="text-white text-sm font-semibold">{confirmed.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Date</span>
                  <span className="text-white text-sm font-semibold">{confirmed.date}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-sm">Time Slot{confirmed.timeSlotLabels.length > 1 ? "s" : ""}</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {confirmed.timeSlotLabels.map((label) => (
                      <span key={label} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-slate-700" />
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Total Paid</span>
                  <span className="text-xl font-extrabold text-green-400">₱{confirmed.price}</span>
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300/80 mb-4">
                Status is <strong>Pending</strong> until payment is verified.
              </div>

              <a
                href={`/status?id=${confirmed.id}`}
                className="block w-full text-center bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white font-semibold py-3 rounded-xl transition-colors mb-3"
              >
                Check Booking Status →
              </a>

              <button onClick={resetBooking}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-200">
                Book Another Session
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function isToday(date: Date): boolean {
  const t = new Date();
  return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
}
