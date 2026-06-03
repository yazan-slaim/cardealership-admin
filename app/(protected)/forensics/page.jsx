"use client";

import React, { useState } from "react";
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign,
  Tag,
  Image as ImageIcon
} from "lucide-react";

export default function ForensicsIndexPage() {
  const [vinInput, setVinInput] = useState("");
  const [activeVin, setActiveVin] = useState("");
  const [error, setError] = useState("");
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanVin = vinInput.trim().toUpperCase();
    
    if (!cleanVin) {
      setError("Please enter a valid VIN.");
      return;
    }
    
    if (cleanVin.length !== 17) {
      setError("VIN must be exactly 17 characters long.");
      return;
    }

    setError("");
    setActiveVin(cleanVin);
    
    // Fetch data
    try {
      setLoading(true);
      setFetchError("");
      setData(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const res = await fetch(`${apiUrl}/api/vehicle/forensics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: cleanVin }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch forensics data");
      }

      const json = await res.json();
      setData(json.analysis);
    } catch (err) {
      console.error(err);
      setFetchError("Error loading vehicle forensics data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 md:p-12">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Search Header Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <Search className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vehicle Forensics</h1>
                <p className="text-gray-500 text-sm">Deep background check & pricing.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex-grow relative">
                <input
                  id="vin"
                  type="text"
                  value={vinInput}
                  onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                  placeholder="Enter 17-character VIN..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all uppercase"
                  maxLength={17}
                  autoComplete="off"
                />
                {error && <p className="absolute -bottom-5 left-2 text-xs text-red-600 font-medium">{error}</p>}
              </div>
              
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                Run Audit
              </button>
            </form>
          </div>
        </div>

        {/* Results Area */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 shadow-sm flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-900 text-lg animate-pulse font-medium">Running Forensic Audit on {activeVin}...</p>
          </div>
        )}

        {!loading && fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center shadow-sm">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Audit Failed</h2>
            <p className="text-gray-600">{fetchError}</p>
          </div>
        )}

        {!loading && !fetchError && data && (
          <ForensicDashboard data={data} vin={activeVin} />
        )}
        
        {!loading && !fetchError && !data && activeVin === "" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 shadow-sm flex flex-col items-center justify-center text-center">
            <ShieldCheck className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-500">Awaiting VIN Submission</h2>
            <p className="text-gray-400 mt-2 max-w-md">Enter a VIN above to automatically extract customs fees, auction history, market saturation, and precise buy/sell limits.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function ForensicDashboard({ data, vin }) {
  const { tax, market, bid, audit, images } = data;

  const isRedRisk = audit?.riskTag === "RED";
  const riskColor = isRedRisk ? "text-red-700" : audit?.riskTag === "YELLOW" ? "text-yellow-700" : "text-green-700";
  const bgRiskColor = isRedRisk ? "bg-red-100 border-red-200" : audit?.riskTag === "YELLOW" ? "bg-yellow-100 border-yellow-200" : "bg-green-100 border-green-200";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Audit Results
          </h2>
          <p className="text-gray-500 mt-1 font-mono">{vin}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border ${bgRiskColor} flex items-center gap-2 shadow-sm`}>
          {isRedRisk ? <AlertTriangle className={`h-6 w-6 ${riskColor}`} /> : <ShieldCheck className={`h-6 w-6 ${riskColor}`} />}
          <span className={`font-bold tracking-wider ${riskColor}`}>RISK: {audit?.riskTag || "UNKNOWN"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Valuation & Pricing */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="h-32 w-32 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 relative z-10">
              <Tag className="h-6 w-6 text-green-600" /> 
              Acquisition Strategy
            </h2>
            
            <div className="space-y-6 relative z-10">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 font-medium">Target Retail (Sell At)</p>
                <p className="text-4xl font-bold text-gray-900">
                  {bid?.adjustedRetailPrice?.toLocaleString() || 0} <span className="text-lg text-gray-500">JOD</span>
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 uppercase tracking-wider mb-1 font-medium">Maximum Bid (Start At)</p>
                <p className="text-4xl font-bold text-green-600">
                  ${bid?.maximumBidUSD?.toLocaleString() || 0} <span className="text-lg text-green-700">USD</span>
                </p>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Approx. {bid?.maximumBidJOD?.toLocaleString() || 0} JOD
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Estimated Customs (JCD)</span>
                <span className="text-gray-900 font-medium">{tax?.totalLandedCost?.toLocaleString() || 0} JOD</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Shipping Estimate</span>
                <span className="text-gray-900 font-medium">$1,500 USD</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Audit Bullets & Images */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Audit Bullets */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Forensic Audit Findings</h2>
            <ul className="space-y-4">
              {audit?.bullets?.map((bullet, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shadow-sm shadow-red-200" />
                  </span>
                  <span className="text-gray-700 leading-relaxed">{bullet}</span>
                </li>
              ))}
              {(!audit?.bullets || audit.bullets.length === 0) && (
                <p className="text-gray-500 italic">No significant flags detected.</p>
              )}
            </ul>
          </div>

          {/* Bidfax Images Gallery */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <ImageIcon className="h-6 w-6 text-gray-500" />
              Auction Photos (BidFax)
            </h2>
            
            {images && images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200">
                    {/* Using standard img tag because next/image requires domain config for external URLs */}
                    <img 
                      src={src} 
                      alt={`Auction photo ${i+1}`}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                <ImageIcon className="h-12 w-12 mb-2 opacity-50 text-gray-400" />
                <p>No auction images recovered.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
