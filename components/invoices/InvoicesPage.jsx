"use client";
import React, { useState, useMemo } from "react";
import {
  FileText, Search, DollarSign, Clock, CheckCircle2,
  AlertTriangle, XCircle, Send,
} from "lucide-react";
import clsx from "clsx";

const STATUS_CONFIG = {
  draft:     { label: "Draft",     icon: FileText,       color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  sent:      { label: "Sent",      icon: Send,           color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  paid:      { label: "Paid",      icon: CheckCircle2,   color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  overdue:   { label: "Overdue",   icon: AlertTriangle,  color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  cancelled: { label: "Cancelled", icon: XCircle,        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
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

export default function InvoicesPage({ invoices: initialInvoices }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const rowsPerPage = 15;

  const filtered = useMemo(() => {
    let result = invoices;
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber?.toLowerCase().includes(lower) ||
          inv.renter?.fullName?.toLowerCase().includes(lower) ||
          inv.booking?.bookingNumber?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }
    return result;
  }, [invoices, searchText, statusFilter]);

  const paginatedRows = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // Stats
  const stats = {
    total: invoices.length,
    totalRevenue: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + (i.paidAmount || i.totalAmount || 0), 0),
    outstanding: invoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((sum, i) => sum + (i.amountDue || 0), 0),
    overdue: invoices.filter((i) => i.status === "overdue").length,
  };

  const handleStatusUpdate = async (invoiceId, newStatus, extra = {}) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, ...extra }),
      });
      if (res.ok) {
        const { invoice } = await res.json();
        setInvoices((prev) => prev.map((i) => (i._id === invoiceId ? { ...i, ...invoice } : i)));
      }
    } catch (err) {
      console.error("Invoice status update error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track payments and manage rental invoices
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Invoices</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Collected</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalRevenue)}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Outstanding</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.outstanding)}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">Overdue</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.overdue}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice #, customer, or booking #..."
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "draft", "sent", "paid", "overdue", "cancelled"].map((s) => (
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

      {/* Invoice Table */}
      <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Invoice #</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Booking</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Due</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Due Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((inv) => {
                  const sc = STATUS_CONFIG[inv.status] || STATUS_CONFIG.draft;
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={inv._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                          {inv.invoiceNumber || "—"}
                        </span>
                        <p className="text-xs text-gray-400">{formatDate(inv.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{inv.renter?.fullName || "—"}</p>
                        <p className="text-xs text-gray-400">{inv.renter?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{inv.booking?.bookingNumber || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(inv.totalAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx("text-sm font-semibold", inv.amountDue > 0 ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400")}>
                          {formatCurrency(inv.amountDue)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(inv.dueDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold", sc.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {inv.status === "draft" && (
                            <button
                              onClick={() => handleStatusUpdate(inv._id, "sent")}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                            >
                              Send
                            </button>
                          )}
                          {(inv.status === "sent" || inv.status === "overdue") && (
                            <button
                              onClick={() => handleStatusUpdate(inv._id, "paid", {
                                paidAmount: inv.totalAmount,
                                paidAt: new Date().toISOString(),
                              })}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                            >
                              Mark Paid
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
    </div>
  );
}
