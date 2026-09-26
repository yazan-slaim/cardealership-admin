"use client";
import React, { useState, useMemo } from "react";
import {
  CalendarDays, Search, Plus, Clock, CheckCircle2, XCircle,
  AlertTriangle, Car, ChevronRight, Filter, X,
} from "lucide-react";
import clsx from "clsx";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   icon: Clock,          color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  confirmed: { label: "Confirmed", icon: CheckCircle2,   color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  active:    { label: "Active",    icon: Car,            color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  completed: { label: "Completed", icon: CheckCircle2,   color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelled", icon: XCircle,        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  overdue:   { label: "Overdue",   icon: AlertTriangle,  color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatCurrency(amount) {
  if (amount == null) return "—";
  return `${Number(amount).toLocaleString()} JOD`;
}

export default function BookingsPage({ bookings: initialBookings, availableVehicles, customers }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 15;

  // New booking form state
  const [newBooking, setNewBooking] = useState({
    fleet: "",
    renter: "",
    pickupDate: "",
    returnDate: "",
    rateType: "daily",
    rateAmount: "",
    deposit: "",
    pickupLocation: "",
    adminNotes: "",
  });

  const filtered = useMemo(() => {
    let result = bookings;
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (b) =>
          b.bookingNumber?.toLowerCase().includes(lower) ||
          b.fleet?.title?.toLowerCase().includes(lower) ||
          b.renter?.fullName?.toLowerCase().includes(lower) ||
          b.fleet?.licensePlate?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }
    return result;
  }, [bookings, searchText, statusFilter]);

  const paginatedRows = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // Stats
  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    pending: bookings.filter((b) => b.status === "pending" || b.status === "confirmed").length,
    overdue: bookings.filter((b) => b.status === "overdue").length,
    revenue: bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  // Auto-set rate when vehicle is selected
  const handleVehicleSelect = (fleetId) => {
    const vehicle = availableVehicles.find((v) => v._id === fleetId);
    if (vehicle) {
      const rateKey = newBooking.rateType === "weekly" ? "weeklyRate" : newBooking.rateType === "monthly" ? "monthlyRate" : "dailyRate";
      setNewBooking({
        ...newBooking,
        fleet: fleetId,
        rateAmount: vehicle[rateKey] || vehicle.dailyRate || "",
      });
    } else {
      setNewBooking({ ...newBooking, fleet: fleetId, rateAmount: "" });
    }
  };

  const handleCreateBooking = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });
      if (res.ok) {
        const { booking } = await res.json();
        setBookings([booking, ...bookings]);
        setShowNewBookingModal(false);
        setNewBooking({
          fleet: "", renter: "", pickupDate: "", returnDate: "",
          rateType: "daily", rateAmount: "", deposit: "", pickupLocation: "", adminNotes: "",
        });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create booking");
      }
    } catch (err) {
      console.error("Create booking error:", err);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus, extra = {}) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, ...extra }),
      });
      if (res.ok) {
        const { booking } = await res.json();
        setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, ...booking } : b)));
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage rental reservations and track active rentals
          </p>
        </div>
        <button
          onClick={() => setShowNewBookingModal(true)}
          className="inline-flex items-center gap-2 bg-[#0f4098] hover:bg-blue-900 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.active}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Pending</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">Overdue</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.overdue}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Revenue</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.revenue)}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by booking #, vehicle, customer, or plate..."
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "active", "completed", "overdue", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={clsx(
                "px-3 py-2 rounded-lg text-xs font-semibold transition-colors border",
                statusFilter === s
                  ? "bg-[#0f4098] text-white border-[#0f4098]"
                  : "bg-white dark:bg-[#171717] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Booking</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Vehicle</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Dates</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((booking) => {
                  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                          {booking.bookingNumber || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                            {booking.fleet?.images?.[0] ? (
                              <img src={booking.fleet.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
                              {booking.fleet?.title || "—"}
                            </p>
                            <p className="text-xs text-gray-400">{booking.fleet?.licensePlate || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.renter?.fullName || "—"}</p>
                        <p className="text-xs text-gray-400">{booking.renter?.phoneNumber || ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-700 dark:text-gray-300">{formatDate(booking.pickupDate)}</p>
                        <p className="text-xs text-gray-400">→ {formatDate(booking.returnDate)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(booking.totalAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold", sc.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {(booking.status === "pending" || booking.status === "confirmed") && (
                            <button
                              onClick={() => handleStatusUpdate(booking._id, "active")}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                            >
                              Pickup
                            </button>
                          )}
                          {(booking.status === "active" || booking.status === "overdue") && (
                            <button
                              onClick={() => handleStatusUpdate(booking._id, "completed")}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              Return
                            </button>
                          )}
                          {booking.status !== "completed" && booking.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Previous
            </button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Booking</h2>
              <button onClick={() => setShowNewBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Vehicle */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Vehicle *</label>
                <select
                  value={newBooking.fleet}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                >
                  <option value="">Select a vehicle...</option>
                  {availableVehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.title || `${v.carMake} ${v.model}`} — {v.dailyRate} JOD/day
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Customer *</label>
                <select
                  value={newBooking.renter}
                  onChange={(e) => setNewBooking({ ...newBooking, renter: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                >
                  <option value="">Select a customer...</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} — {c.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Pickup Date *</label>
                  <input
                    type="date"
                    value={newBooking.pickupDate}
                    onChange={(e) => setNewBooking({ ...newBooking, pickupDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Return Date *</label>
                  <input
                    type="date"
                    value={newBooking.returnDate}
                    onChange={(e) => setNewBooking({ ...newBooking, returnDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                  />
                </div>
              </div>

              {/* Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Rate Type</label>
                  <select
                    value={newBooking.rateType}
                    onChange={(e) => setNewBooking({ ...newBooking, rateType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Rate (JOD) *</label>
                  <input
                    type="number"
                    value={newBooking.rateAmount}
                    onChange={(e) => setNewBooking({ ...newBooking, rateAmount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Deposit & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Deposit (JOD)</label>
                  <input
                    type="number"
                    value={newBooking.deposit}
                    onChange={(e) => setNewBooking({ ...newBooking, deposit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Pickup Location</label>
                  <input
                    type="text"
                    value={newBooking.pickupLocation}
                    onChange={(e) => setNewBooking({ ...newBooking, pickupLocation: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
                    placeholder="Office / Branch"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea
                  value={newBooking.adminNotes}
                  onChange={(e) => setNewBooking({ ...newBooking, adminNotes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30 resize-none"
                  rows={2}
                  placeholder="Internal notes..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={!newBooking.fleet || !newBooking.renter || !newBooking.pickupDate || !newBooking.returnDate || !newBooking.rateAmount}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#0f4098] hover:bg-blue-900 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
