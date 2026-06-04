"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Filter, Users, Percent, DollarSign, ListFilter, LayoutGrid } from "lucide-react";
import clsx from "clsx";

export default function LeadPipelinePage() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real enquiries on mount
  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const res = await fetch("/api/enquiry");
        const data = await res.json();
        setEnquiries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch enquiries", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEnquiries();
  }, []);

  // Mock AI Bouncer generator based on ID/index for consistency
  const getMockAI = (id, index) => {
    const r = (index * 7 + 13) % 100;
    if (r > 66) return { badge: "HOT", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", text: "Bouncer Passed" };
    if (r > 33) return { badge: "WARM", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500", text: "Evaluating" };
    return { badge: "COLD", color: "bg-slate-100 text-slate-600", dot: "bg-slate-400", text: "Tire-Kicker Detected" };
  };

  const getSource = (index) => {
    const sources = ["OpenSooq", "Website", "Facebook", "Instagram"];
    return sources[index % sources.length];
  };

  const getTime = (index) => {
    const times = ["10 mins ago", "2 hours ago", "Yesterday", "2 days ago"];
    return times[index % times.length];
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Lead Pipeline</h1>
          <p className="text-slate-500 text-sm">Manage and qualify incoming inquiries. AI Bouncer is active.</p>
        </div>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">NEW LEADS TODAY</h3>
            <div className="p-2 bg-slate-100 rounded-md text-slate-400"><Users className="w-4 h-4" /></div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-slate-900">42</span>
            <span className="text-sm font-semibold text-emerald-600 flex items-center mb-1">
              ↑ 12%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">CONVERSION RATE</h3>
            <div className="p-2 bg-blue-50 rounded-md text-blue-500"><Percent className="w-4 h-4" /></div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-slate-900">18.5%</span>
            <span className="text-sm font-semibold text-emerald-600 flex items-center mb-1">
              ↑ 2.1%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">TOTAL PIPELINE VALUE</h3>
            <div className="p-2 bg-emerald-50 rounded-md text-emerald-600 relative z-10"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <span className="text-4xl font-bold text-slate-900">1.2M</span>
            <span className="text-sm font-bold text-slate-500 mb-1">JOD</span>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 opacity-50 pointer-events-none" />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Table Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">Active Inquiries</h2>
          <div className="flex gap-2">
            <button className="p-1.5 text-slate-400 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ListFilter className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">CONTACT</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">INTEREST</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">AI BOUNCER / SCORE</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">SOURCE / LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                    Loading inquiries...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                    No active inquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq, idx) => {
                  const name = enq.name || enq.title || "Unknown User";
                  const phone = enq.phone || "+962 00 000 0000";
                  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U";
                  const car = enq.carInterest || enq.subject || "General Inquiry";
                  const specs = enq.message?.substring(0, 30) || "Evaluating options";
                  
                  const ai = getMockAI(enq._id, idx);
                  const isCold = ai.badge === "COLD";
                  
                  return (
                    <tr key={enq._id} className={clsx("transition-colors hover:bg-slate-50", isCold && "bg-slate-50/50 opacity-75")}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                            isCold ? "bg-slate-200 text-slate-500" : "bg-blue-100 text-blue-700"
                          )}>
                            {initials}
                          </div>
                          <div>
                            <p className={clsx("text-sm font-bold", isCold ? "text-slate-500" : "text-slate-900")}>{name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={clsx("text-sm font-bold", isCold ? "text-slate-500" : "text-slate-900")}>{car}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{specs}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold tracking-wider", ai.color)}>
                            {ai.badge}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <span className={clsx("w-1.5 h-1.5 rounded-full", ai.dot)}></span>
                            {ai.text}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium mb-0.5">
                          <span className={clsx("w-1.5 h-1.5 rounded-full", ai.dot)}></span>
                          {getSource(idx)}
                        </div>
                        <p className="text-xs text-slate-400">{getTime(idx)}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
