"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, Sparkles, ArrowDownRight, ArrowUpRight, BarChart3, Minus, Users } from "lucide-react";
import clsx from "clsx";

export default function CarMakesPage() {
  const [analysis, setAnalysis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/carmake/analysis");
        if (res.ok) {
          const data = await res.json();
          setAnalysis(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch car make analysis", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  // Compute top-level metrics
  let fastestMover = { make: "N/A", avgDaysToSell: 0 };
  let highestDemand = { make: "N/A", demandScore: 0 };
  let bestConversion = { make: "N/A", conversionRate: 0 };
  let overallListingAvg = 0;
  let overallSaleAvg = 0;
  let validPricingMakes = 0;

  if (analysis.length > 0) {
    const soldMakes = analysis.filter(a => a.soldUnits > 0);
    if (soldMakes.length > 0) {
      fastestMover = soldMakes.reduce((prev, curr) => (prev.avgDaysToSell < curr.avgDaysToSell ? prev : curr));
    }
    highestDemand = analysis.reduce((prev, curr) => (prev.demandScore > curr.demandScore ? prev : curr));
    
    const convertingMakes = analysis.filter(a => a.conversionRate > 0);
    if (convertingMakes.length > 0) {
      bestConversion = convertingMakes.reduce((prev, curr) => (prev.conversionRate > curr.conversionRate ? prev : curr));
    }

    // Averages for competitive pricing block
    analysis.forEach(a => {
      if (a.avgListingPrice > 0 && a.avgSalePrice > 0) {
        overallListingAvg += a.avgListingPrice;
        overallSaleAvg += a.avgSalePrice;
        validPricingMakes++;
      }
    });
  }

  let globalPriceGap = 0;
  if (validPricingMakes > 0) {
    globalPriceGap = ((overallSaleAvg - overallListingAvg) / overallListingAvg) * 100;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Advanced Market Analysis</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Real-time dealership performance metrics, inventory density, and predictive demand forecasting based on actual sales and enquiry data.
          </p>
        </div>
        <div className="flex items-center">
          <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Live Database Connection
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
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{fastestMover.make}</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-emerald-700">{fastestMover.avgDaysToSell > 0 ? fastestMover.avgDaysToSell : "--"} Days</span>
            <span className="text-sm font-semibold text-slate-500 mb-1">avg time on lot</span>
          </div>
        </div>

        {/* Highest Demand */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-[#0f4098]">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Highest Demand</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{highestDemand.make}</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#0f4098]">{highestDemand.demandScore}/100</span>
            <span className="text-sm font-semibold text-slate-500 mb-1">demand score</span>
          </div>
        </div>

        {/* Best Conversion Rate */}
        <div className="bg-[#f8faff] border border-blue-100 rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Users className="w-4 h-4 text-blue-700" />
            <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase">Top Converting Brand</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">{bestConversion.make}</h3>
          <div className="flex items-end gap-2 relative z-10">
            <span className="text-4xl font-bold text-blue-700">{bestConversion.conversionRate}%</span>
            <span className="text-sm font-semibold text-slate-500 mb-1">lead-to-sale rate</span>
          </div>
          <Sparkles className="absolute -right-8 -bottom-8 w-32 h-32 text-blue-50 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Brand Inventory & Demand) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Brand Inventory & Demand</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-2 text-center py-12 text-slate-500 text-sm">Loading market data...</div>
            ) : analysis.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-slate-500 text-sm">No data available for market analysis.</div>
            ) : (
              analysis.map((data, idx) => {
                const make = data.make || "Unknown";
                const demandProgress = data.demandScore;
                const TIcon = data.priceGapPercent > 0 ? ArrowUpRight : (data.priceGapPercent < 0 ? ArrowDownRight : Minus);
                const tColor = data.priceGapPercent > 0 ? "text-emerald-600" : (data.priceGapPercent < 0 ? "text-red-600" : "text-slate-500");

                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f0f4fc] text-[#0f4098] flex items-center justify-center font-bold text-sm">
                          {make.substring(0,3).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 leading-tight truncate max-w-[150px]">{make}</h3>
                          <p className="text-xs text-slate-500">{data.soldUnits} all-time sales</p>
                        </div>
                      </div>
                      <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold tracking-wider", data.trendColor)}>
                        {data.trendStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Inventory</span>
                      <span className="font-bold text-slate-900">{data.activeUnits} units</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                      <div className={clsx("h-1.5 rounded-full", data.trendStatus === "Slow" ? "bg-red-500" : data.trendStatus === "Stable" ? "bg-slate-500" : "bg-emerald-500")} style={{ width: `${demandProgress}%` }}></div>
                    </div>
                    <p className="text-right text-[10px] text-slate-400 font-medium mb-4">Demand Score: {data.demandScore}/100</p>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Conversion Rate</span>
                        <div className="text-sm font-bold text-slate-700">{data.conversionRate}%</div>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-end gap-1">
                           Price Trend <TIcon className={clsx("w-3 h-3", tColor)} />
                         </span>
                         <div className={clsx("text-sm font-bold", tColor)}>
                           {data.priceGapPercent > 0 ? "+" : ""}{data.priceGapPercent.toFixed(1)}%
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Charts & Pricing) */}
        <div className="space-y-6 pt-1 lg:pt-12">
          
          {/* Sell-Through Velocity Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold text-slate-900">Velocity by Brand</h3>
               <BarChart3 className="w-4 h-4 text-slate-400" />
             </div>
             
             {/* Chart */}
             <div className="h-40 relative flex items-end justify-between px-2 pb-6 border-b border-slate-100">
                <span className="absolute left-0 bottom-[100%] text-[10px] text-slate-400 -mb-2">90d</span>
                <span className="absolute left-0 bottom-[50%] text-[10px] text-slate-400 -mb-2">45d</span>
                <span className="absolute left-0 bottom-0 text-[10px] text-slate-400 -mb-2">0d</span>
                
                {analysis.slice(0, 5).map((a, i) => {
                  const heightPercent = Math.min(100, (a.avgDaysToSell / 90) * 100) || 5;
                  return (
                    <div key={i} className="w-8 bg-blue-100 rounded-t-sm relative group cursor-pointer hover:bg-blue-200 transition-colors flex flex-col justify-end items-center" style={{ height: `${heightPercent}%` }}>
                      <span className="absolute -top-6 text-[10px] font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {a.avgDaysToSell}d
                      </span>
                    </div>
                  )
                })}
             </div>
             
             <div className="flex justify-between px-2 pt-2 text-[10px] font-bold text-slate-400">
                {analysis.slice(0, 5).map((a, i) => (
                  <span key={i} className="truncate max-w-[40px] text-center w-8">{a.make.substring(0,3).toUpperCase()}</span>
                ))}
             </div>
             
             <p className="text-xs text-slate-500 mt-6 text-center">Average days in stock before sale.</p>
          </div>

          {/* Competitive Pricing */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h3 className="font-bold text-slate-900 mb-1">Global Price Variance</h3>
                 <p className="text-xs text-slate-500">Average sold price vs. Initial listing</p>
               </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className={clsx("w-12 h-12 rounded-lg flex items-center justify-center", 
                  globalPriceGap >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                )}>
                  {globalPriceGap >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {globalPriceGap > 0 ? "+" : ""}{globalPriceGap.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {globalPriceGap >= 0 ? "Selling above asking" : "Selling below asking"}
                  </p>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
