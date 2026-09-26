"use client";
import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Search, Plus, MoreHorizontal, Car, Wrench, CheckCircle,
  Fuel, Users, Calendar, DollarSign, Filter, X,
} from "lucide-react";
import clsx from "clsx";

const STATUS_CONFIG = {
  available: { label: "Available", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  rented: { label: "Rented", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  maintenance: { label: "Maintenance", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  reserved: { label: "Reserved", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  retired: { label: "Retired", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

export default function FleetPage({ collection }) {
  const [rows, setRows] = useState(collection);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const rowsPerPage = 12;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    applyFilters(searchText, status);
    setPage(0);
  };

  const applyFilters = (search, status) => {
    let filtered = collection;
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title?.toLowerCase().includes(lower) ||
          v.carMake?.toLowerCase().includes(lower) ||
          v.model?.toLowerCase().includes(lower) ||
          v.licensePlate?.toLowerCase().includes(lower)
      );
    }
    if (status !== "all") {
      filtered = filtered.filter((v) => v.status === status);
    }
    setRows(filtered);
  };

  const handleStatusToggle = async (vehicle, newStatus) => {
    try {
      const res = await fetch(`/api/fleet/${vehicle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((v) => (v._id === vehicle._id ? { ...v, status: newStatus } : v))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Stats
  const stats = {
    total: collection.length,
    available: collection.filter((v) => v.status === "available").length,
    rented: collection.filter((v) => v.status === "rented").length,
    maintenance: collection.filter((v) => v.status === "maintenance").length,
    reserved: collection.filter((v) => v.status === "reserved").length,
  };

  const utilization = stats.total > 0 ? Math.round(((stats.rented + stats.reserved) / stats.total) * 100) : 0;

  const paginatedRows = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fleet Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your rental vehicle fleet
          </p>
        </div>
        <Link
          href="/fleet/post-product"
          className="inline-flex items-center gap-2 bg-[#0f4098] hover:bg-blue-900 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Fleet</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Available</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.available}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Rented</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.rented}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Maintenance</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.maintenance}</div>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">Utilization</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{utilization}%</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, make, model, or plate..."
            value={searchText}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "available", "rented", "maintenance", "reserved"].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
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

      {/* Fleet Grid */}
      {paginatedRows.length === 0 ? (
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-12 text-center">
          <Car className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No vehicles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedRows.map((vehicle) => {
            const statusCfg = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.available;
            return (
              <div
                key={vehicle._id}
                className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {vehicle.images?.[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  <span className={clsx("absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold", statusCfg.color)}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {vehicle.title || `${vehicle.year} ${vehicle.carMake} ${vehicle.model}`}
                    </h3>
                    {vehicle.licensePlate && (
                      <p className="text-xs text-gray-400 mt-0.5">{vehicle.licensePlate}</p>
                    )}
                  </div>

                  {/* Quick specs */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {vehicle.transmission && (
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        {vehicle.transmission === "Automatic" ? "Auto" : "Manual"}
                      </span>
                    )}
                    {vehicle.fuel && (
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" />
                        {vehicle.fuel}
                      </span>
                    )}
                    {vehicle.seats && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {vehicle.seats}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#0f4098] dark:text-blue-400">
                      {vehicle.dailyRate?.toLocaleString()} JOD
                    </span>
                    <span className="text-xs text-gray-400">/day</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/fleet/${vehicle._id}`}
                      className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    >
                      View Details
                    </Link>
                    {vehicle.status === "available" && (
                      <button
                        onClick={() => handleStatusToggle(vehicle, "maintenance")}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                        title="Send to maintenance"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {vehicle.status === "maintenance" && (
                      <button
                        onClick={() => handleStatusToggle(vehicle, "available")}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                        title="Mark as available"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
