"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter, MapPin, MessageSquare, MoreVertical } from "lucide-react";
import clsx from "clsx";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients/getclients");
        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const term = searchQuery.toLowerCase();
    return (
      client.fullName?.toLowerCase().includes(term) ||
      client.phoneNumber?.includes(term) ||
      client.email?.toLowerCase().includes(term)
    );
  });

  // Mock AI Matcher generator based on ID/index for consistency
  const getMockAIMatcher = (id, index) => {
    const r = (index * 13 + 42) % 100;
    if (r > 80) return { percent: r, color: "bg-emerald-700 text-white", desc: "Matching wishlist to incoming luxury SUV inventory." };
    if (r > 60) return { percent: r, color: "bg-blue-100 text-blue-700", desc: "Looking for specific EV trim not currently in stock." };
    return { percent: r, color: "bg-emerald-700 text-white", desc: "Strong match with recent compact SUV addition." };
  };

  const getMockPurchases = (index) => [3, 1, 0, 2, 5][index % 5];
  const getMockInterest = (index) => ["Luxury SUV", "Sedan EV", "Compact SUV", "Hybrid Sedan", "Sports Car"][index % 5];
  const getMockLocation = (index) => ["Amman, Abdoun", "Zarqa", "Amman, Khalda", "Irbid", "Aqaba"][index % 5];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Clients Database</h1>
          <p className="text-slate-500 text-sm">Directory of past buyers and active prospects.</p>
        </div>
        
        <div className="flex flex-col gap-3 md:w-[400px]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
              />
            </div>
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
          <div className="flex gap-2">
            <span className="bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold cursor-pointer">High-Value Buyers</span>
            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-slate-300 transition-colors">EV Enthusiasts</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center text-slate-400 py-12 text-sm">Loading clients...</div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center text-slate-400 py-12 text-sm">No clients found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map((client, idx) => {
            const name = client.fullName || "Unknown Client";
            const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U";
            const location = getMockLocation(idx);
            const purchases = getMockPurchases(idx);
            const interest = getMockInterest(idx);
            const ai = getMockAIMatcher(client._id, idx);
            
            return (
              <div key={client._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 pr-6">{name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mb-6 bg-slate-50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">Total Purchases</p>
                    <p className="font-bold text-slate-900">{purchases} {purchases === 1 ? 'Vehicle' : 'Vehicles'}</p>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">Active Interest</p>
                    <p className="font-bold text-slate-900">{interest}</p>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f4098]">
                      <Zap className="w-3.5 h-3.5" /> AI MATCHER
                    </div>
                    <span className={clsx("px-2 py-0.5 rounded-md text-[10px] font-bold", ai.color)}>
                      {ai.percent}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {ai.desc}
                  </p>
                </div>

                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg py-2.5 font-semibold text-sm flex items-center justify-center gap-2 transition-colors mt-auto">
                  <MessageSquare className="w-4 h-4" /> Quick Contact
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
