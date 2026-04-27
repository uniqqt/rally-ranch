"use client";

import { useState, useEffect } from "react";
import { getAllBookings, updateBookingStatus, deleteBooking } from "@/lib/bookings";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  CalendarDays,
  Users,
  PhilippinePeso,
  Eye,
  X,
  Trash2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/30",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Booking["status"]>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  const ADMIN_PASSWORD = "rallyranch2024";

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) fetchBookings();
  }, [authed]);

  const handleStatusUpdate = async (id: string, status: Booking["status"]) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, status } : null);
      }
      toast.success(`Booking ${status}!`);
    } catch {
      toast.error("Update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this booking?")) return;
    setDeletingId(id);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBooking?.id === id) setSelectedBooking(null);
      toast.success("Booking deleted.");
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.date.includes(search);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.price, 0),
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <Toaster position="top-center" />
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold">RR</span>
          </div>
          <h1 className="text-white font-bold text-xl text-center mb-1">Admin Access</h1>
          <p className="text-slate-400 text-sm text-center mb-6">Rally Ranch Pickleball</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && password === ADMIN_PASSWORD && setAuthed(true)}
            placeholder="Enter admin password"
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-4"
          />
          <button
            onClick={() => {
              if (password === ADMIN_PASSWORD) {
                setAuthed(true);
              } else {
                toast.error("Incorrect password.");
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl"
          >
            Sign In
          </button>
          <div className="mt-4 text-center">
            <Link href="/" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155", borderRadius: "12px" },
        }}
      />

      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RR</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Admin Dashboard</h1>
              <p className="text-slate-500 text-xs mt-0.5">Rally Ranch Pickleball</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total, icon: <CalendarDays className="w-5 h-5" />, color: "text-blue-400" },
            { label: "Pending", value: stats.pending, icon: <Clock className="w-5 h-5" />, color: "text-yellow-400" },
            { label: "Confirmed", value: stats.confirmed, icon: <Users className="w-5 h-5" />, color: "text-green-400" },
            { label: "Revenue", value: `₱${stats.revenue.toLocaleString()}`, icon: <PhilippinePeso className="w-5 h-5" />, color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className={`${stat.color} mb-3`}>{stat.icon}</div>
              <div className="text-2xl font-extrabold text-white">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or date…"
              className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Loading bookings…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <CalendarDays className="w-10 h-10 mb-3 opacity-30" />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Date", "Time Slot", "Name", "Phone", "Amount", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((booking) => {
                    const cfg = STATUS_CONFIG[booking.status];
                    return (
                      <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                          {format(new Date(booking.date + "T00:00:00"), "MMM d, yyyy")}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-300">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(booking.timeSlotLabels ?? []).map((l: string) => (
                              <span key={l} className="text-xs bg-slate-700 px-2 py-0.5 rounded-full whitespace-nowrap">{l}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-white font-medium">{booking.name}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{booking.phone}</td>
                        <td className="px-5 py-4 text-sm font-bold text-white">₱{booking.price}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {booking.status !== "confirmed" && (
                              <button
                                disabled={updatingId === booking.id}
                                onClick={() => handleStatusUpdate(booking.id!, "confirmed")}
                                className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                title="Confirm"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== "cancelled" && (
                              <button
                                disabled={updatingId === booking.id}
                                onClick={() => handleStatusUpdate(booking.id!, "cancelled")}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              disabled={deletingId === booking.id}
                              onClick={() => handleDelete(booking.id!)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking detail modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setSelectedBooking(null)}>
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: "Booking ID", value: `#${selectedBooking.id?.slice(0, 8).toUpperCase()}` },
                { label: "Date", value: format(new Date(selectedBooking.date + "T00:00:00"), "MMMM d, yyyy") },
                { label: "Time Slot(s)", value: (selectedBooking.timeSlotLabels ?? []).join(", ") },
                { label: "Name", value: selectedBooking.name },
                { label: "Phone", value: selectedBooking.phone },
                { label: "Email", value: selectedBooking.email || "—" },
                { label: "Amount", value: `₱${selectedBooking.price}` },
                { label: "Notes", value: selectedBooking.notes || "—" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">{row.label}</span>
                  <span className="text-white text-sm font-medium text-right max-w-[60%]">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-slate-400 text-sm">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[selectedBooking.status].bg} ${STATUS_CONFIG[selectedBooking.status].color}`}>
                  {STATUS_CONFIG[selectedBooking.status].icon}
                  {STATUS_CONFIG[selectedBooking.status].label}
                </span>
              </div>
            </div>

            <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
              <p className="text-blue-300 text-xs">Proof of payment is sent via Facebook Messenger or SMS by the customer.</p>
            </div>

            <div className="flex gap-3 mt-6">
              {selectedBooking.status !== "confirmed" && (
                <button
                  disabled={updatingId === selectedBooking.id}
                  onClick={() => handleStatusUpdate(selectedBooking.id!, "confirmed")}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Confirm
                </button>
              )}
              {selectedBooking.status !== "cancelled" && (
                <button
                  disabled={updatingId === selectedBooking.id}
                  onClick={() => handleStatusUpdate(selectedBooking.id!, "cancelled")}
                  className="flex-1 bg-red-600/20 hover:bg-red-600/40 border border-red-600/40 text-red-400 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                disabled={deletingId === selectedBooking.id}
                onClick={() => handleDelete(selectedBooking.id!)}
                className="p-2.5 bg-red-600/20 hover:bg-red-600/40 border border-red-600/40 text-red-400 rounded-xl transition-colors"
                title="Delete booking"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
