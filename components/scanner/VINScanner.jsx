"use client";
import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, Loader2, FileText } from 'lucide-react';

const VINScanner = ({ onForensicsComplete }) => {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Strict 17-character VIN Regex
  const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

  const handleIngest = async (e) => {
    e.preventDefault();
    setError(null);

    const upperVin = vin.toUpperCase().trim();
    if (!VIN_REGEX.test(upperVin)) {
      setError("Invalid VIN format. Must be 17 characters (no I, O, Q).");
      return;
    }

    setLoading(true);
    try {
      // Phase I & II: Ingest and execute forensic pipeline
      // Note: In a real scenario, we'd gather the other required params (CC, Weight, etc.) 
      // but for this terminal bridge, we simulate the evaluation trigger.
      const response = await fetch('/api/vehicle/forensics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: upperVin,
          make: 'Toyota', // Placeholder: Would be resolved from VIN decoder in prod
          model: 'Camry',
          year: 2022,
          engineCC: 2500,
          curbWeightKg: 1600,
          fuelType: 'HYBRID',
          cifValue: 12000,
          reconditioningEstimate: 400
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.details || err.error || "Forensic Pipeline Failed");
      }

      const data = await response.json();
      onForensicsComplete(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <FileText className="text-blue-500" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Forensic Ingestion</h2>
          <p className="text-gray-500 text-sm">Enter VIN to trigger JCD Tax Engine & AI Audit</p>
        </div>
      </div>

      <form onSubmit={handleIngest} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="ENTER 17-CHARACTER VIN"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-4 px-5 text-xl font-mono text-white tracking-[0.2em] focus:outline-none focus:border-blue-500 transition-all placeholder:text-[#333]"
            maxLength={17}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 className="animate-spin text-blue-500" />
            ) : vin.length === 17 && VIN_REGEX.test(vin) ? (
              <CheckCircle2 className="text-green-500" />
            ) : null}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-400/20">
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || vin.length !== 17}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-[#222] disabled:text-gray-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? "EXECUTING FORENSIC PIPELINE..." : "START ASYNCHRONOUS AUDIT"}
          {!loading && <Search size={20} />}
        </button>
      </form>

      <div className="mt-4 flex justify-between text-[10px] text-gray-600 uppercase tracking-widest font-bold">
        <span>JCD 2026 MATRIX: ACTIVE</span>
        <span>GOOGLE GENAI: CONNECTED</span>
      </div>
    </div>
  );
};

export default VINScanner;
