"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, Sparkles, ArrowDownRight, ArrowUpRight, BarChart3, Minus } from "lucide-react";
import clsx from "clsx";

export default function CarMakesPage() {
  const [makes, setMakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await fetch("/api/carmake");
        if (res.ok) {
          const data = await res.json();
          // Expecting an array of makes
          setMakes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMakes();
  }, []);

  // Use real makes if available, otherwise fallback to the design's specific brands
  const displayMakes = makes.length > 0 
    ? makes.map(m => m.name || m.brandName || m.title || "Brand") 
    : ["BYD", "Toyota", "Tesla", "Mercedes"];

  const getMockTrend = (index) => {
    const trends = [
      { status: "Hot", color: "bg-emerald-100 text-emerald-700", trend: "+2.4%", tColor: "text-emerald-600", units: 142, icon: ArrowUpRight },
      { status: "Stable", color: "bg-slate-200 text-slate-700", trend: "0.0%", tColor: "text-slate-500", units: 318, icon: Minus },
      { status: "Slow", color: "bg-red-100 text-red-700", trend: "-5.2%", tColor: "text-red-600", units: 45, icon: ArrowDownRight },
      { status: "Stable", color: "bg-slate-200 text-slate-700", trend: "+1.1%", tColor: "text-emerald-600", units: 82, icon: ArrowUpRight }
    ];
    return trends[index % trends.length];
  };

  const getSubtitle = (make) => {
    const map = {
      "BYD": "EV / Hybrid focus",
      "Toyota": "Hybrid Leader",
      "Tesla": "Premium EV",
      "Mercedes": "Luxury ICE/EV"
    };
    return map[make] || "Automotive Brand";
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Market Penetration (Car Brands)</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Zarqa Free Zone & Greater Amman brand performance metrics and inventory density. Real-time AI analysis indicates strong shift towards hybrid models.
          </p>
        </div>
        <div className="flex items-center">
          <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Last Updated: Just Now
          </span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Fastest Mover */}
        <div className="bg-[#f2fdf5] border border-emerald-100 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-emerald-700">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Fastest Mover</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">BYD Seagull</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-emerald-700">14 Days</span>
            <span className="text-sm font-semibold text-slate-500 mb-1">avg time on lot</span>
          </div>
        </div>

        {/* Highest Demand */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Highest Demand</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Toyota Prius</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#0f4098]">94/100</span>
            <span className="text-sm font-semibold text-slate-500 mb-1">demand score</span>
          </div>
        </div>

        {/* AI Insight (spans 1 col on large, 2 on medium) */}
        <div className="bg-[#f8faff] border border-blue-100 rounded-xl p-6 md:col-span-2 lg:col-span-1 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Sparkles className="w-4 h-4 text-[#0f4098]" />
            <span className="text-[10px] font-bold text-[#0f4098] tracking-wider uppercase">AI Market Insight</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed relative z-10">
            Chinese EV brands are showing a <strong className="text-[#0f4098]">22% month-over-month increase</strong> in search volume in the Zarqa Free Zone. Recommend increasing inventory for BYD and Changan models under 15,000 JOD.
          </p>
          <Sparkles className="absolute -right-8 -bottom-8 w-32 h-32 text-blue-50 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Brand Inventory) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Brand Inventory & Demand</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-2 text-center py-12 text-slate-500 text-sm">Loading market data...</div>
            ) : (
              displayMakes.map((make, idx) => {
                const trend = getMockTrend(idx);
                const TIcon = trend.icon;
                const progress = Math.min(100, Math.max(10, (trend.units / 350) * 100)); // mock calculation
                
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f0f4fc] text-[#0f4098] flex items-center justify-center font-bold text-sm">
                          {make.substring(0,3).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 leading-tight">{make}</h3>
                          <p className="text-xs text-slate-500">{getSubtitle(make)}</p>
                        </div>
                      </div>
                      <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold tracking-wider", trend.color)}>
                        {trend.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Inventory</span>
                      <span className="font-bold text-slate-900">{trend.units} units</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                      <div className={clsx("h-1.5 rounded-full", trend.status === "Slow" ? "bg-red-500" : trend.status === "Stable" ? "bg-slate-500" : "bg-[#0f4098]")} style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5">
                        <TIcon className={clsx("w-3.5 h-3.5", trend.tColor)} /> Price Trend
                      </span>
                      <span className={clsx("text-sm font-bold", trend.tColor)}>{trend.trend}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Charts & Pricing) */}
        <div className="space-y-6 pt-1 lg:pt-12">
          
          {/* Sell-Through Rate */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold text-slate-900">Zarqa Sell-Through Rate</h3>
               <button className="text-slate-400 hover:text-slate-600"><Minus className="w-4 h-4" /></button>
             </div>
             
             {/* Mock Chart Placeholder */}
             <div className="h-40 relative flex items-end justify-between px-2 pb-6 border-b border-slate-100">
                <span className="absolute left-0 bottom-[100%] text-[10px] text-slate-400 -mb-2">100%</span>
                <span className="absolute left-0 bottom-[50%] text-[10px] text-slate-400 -mb-2">50%</span>
                <span className="absolute left-0 bottom-0 text-[10px] text-slate-400 -mb-2">0%</span>
                
                {/* Bars */}
                <div className="w-8 bg-blue-100 rounded-t-sm h-[80%] ml-8 relative group cursor-pointer hover:bg-blue-200 transition-colors"></div>
                <div className="w-8 bg-blue-100 rounded-t-sm h-[95%] relative group cursor-pointer hover:bg-blue-200 transition-colors"></div>
                <div className="w-8 bg-blue-100 rounded-t-sm h-[40%] relative group cursor-pointer hover:bg-blue-200 transition-colors"></div>
                <div className="w-8 bg-blue-100 rounded-t-sm h-[60%] relative group cursor-pointer hover:bg-blue-200 transition-colors"></div>
                <div className="w-8 bg-blue-100 rounded-t-sm h-[75%] relative group cursor-pointer hover:bg-blue-200 transition-colors"></div>
             </div>
             
             <div className="flex justify-between px-2 pt-2 text-[10px] font-bold text-slate-400">
               <span className="ml-8">BYD</span>
               <span>TYT</span>
               <span>TSL</span>
               <span>MBZ</span>
               <span>KST</span>
             </div>
             
             <p className="text-xs text-slate-500 mt-6 text-center">Percentage of inventory sold within 30 days.</p>
          </div>

          {/* Competitive Pricing */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h3 className="font-bold text-slate-900 mb-1">Competitive Pricing</h3>
                 <p className="text-xs text-slate-500">Your average listing price vs. Market Average</p>
               </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ArrowDownRight className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">-4.2%</p>
                  <p className="text-xs text-slate-500">Below market average</p>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
