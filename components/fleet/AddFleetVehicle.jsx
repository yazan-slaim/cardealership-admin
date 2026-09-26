"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car, Save, ArrowLeft, Upload, X, Plus,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Pickup", "Van", "Luxury", "Sports", "Other"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];

const COMMON_FEATURES = [
  "GPS Navigation", "Bluetooth", "Backup Camera", "Sunroof", "Leather Seats",
  "Heated Seats", "Apple CarPlay", "Android Auto", "Cruise Control", "Parking Sensors",
  "Keyless Entry", "USB Charging", "ABS", "Airbags", "Child Seat Anchor",
];

export default function AddFleetVehicle() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  const [form, setForm] = useState({
    carMake: "",
    model: "",
    trim: "",
    year: new Date().getFullYear(),
    color: "",
    bodyType: "Sedan",
    licensePlate: "",
    vinNumber: "",
    transmission: "Automatic",
    fuel: "Petrol",
    engineSize: "",
    seats: 5,
    mileage: 0,
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    features: [],
    images: [],
    insurancePolicy: "",
    status: "available",
  });

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleFeature = (feature) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const addCustomFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/fleet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          seats: Number(form.seats),
          mileage: Number(form.mileage),
          dailyRate: Number(form.dailyRate),
          weeklyRate: form.weeklyRate ? Number(form.weeklyRate) : undefined,
          monthlyRate: form.monthlyRate ? Number(form.monthlyRate) : undefined,
          engineSize: form.engineSize ? Number(form.engineSize) : undefined,
        }),
      });

      if (res.ok) {
        router.push("/fleet");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add vehicle");
      }
    } catch (err) {
      console.error("Add fleet vehicle error:", err);
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4098]/30 transition-shadow";
  const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/fleet"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Fleet Vehicle</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Add a new vehicle to your rental fleet
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Car className="w-4 h-4 text-[#0f4098]" />
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Make *</label>
              <input type="text" value={form.carMake} onChange={(e) => updateField("carMake", e.target.value)} className={inputClass} placeholder="e.g. Toyota" required />
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input type="text" value={form.model} onChange={(e) => updateField("model", e.target.value)} className={inputClass} placeholder="e.g. Camry" required />
            </div>
            <div>
              <label className={labelClass}>Trim</label>
              <input type="text" value={form.trim} onChange={(e) => updateField("trim", e.target.value)} className={inputClass} placeholder="e.g. SE" />
            </div>
            <div>
              <label className={labelClass}>Year *</label>
              <input type="number" value={form.year} onChange={(e) => updateField("year", e.target.value)} className={inputClass} min={2000} max={2030} required />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input type="text" value={form.color} onChange={(e) => updateField("color", e.target.value)} className={inputClass} placeholder="e.g. White" />
            </div>
            <div>
              <label className={labelClass}>Body Type</label>
              <select value={form.bodyType} onChange={(e) => updateField("bodyType", e.target.value)} className={inputClass}>
                {BODY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>License Plate</label>
              <input type="text" value={form.licensePlate} onChange={(e) => updateField("licensePlate", e.target.value)} className={inputClass} placeholder="e.g. 12-34567" />
            </div>
            <div>
              <label className={labelClass}>VIN</label>
              <input type="text" value={form.vinNumber} onChange={(e) => updateField("vinNumber", e.target.value)} className={inputClass} placeholder="Vehicle ID Number" />
            </div>
            <div>
              <label className={labelClass}>Seats</label>
              <input type="number" value={form.seats} onChange={(e) => updateField("seats", e.target.value)} className={inputClass} min={1} max={15} />
            </div>
          </div>
        </div>

        {/* Technical */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Technical Specs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Transmission</label>
              <select value={form.transmission} onChange={(e) => updateField("transmission", e.target.value)} className={inputClass}>
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fuel</label>
              <select value={form.fuel} onChange={(e) => updateField("fuel", e.target.value)} className={inputClass}>
                {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Engine (cc)</label>
              <input type="number" value={form.engineSize} onChange={(e) => updateField("engineSize", e.target.value)} className={inputClass} placeholder="e.g. 2500" />
            </div>
            <div>
              <label className={labelClass}>Mileage (km)</label>
              <input type="number" value={form.mileage} onChange={(e) => updateField("mileage", e.target.value)} className={inputClass} min={0} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Rental Pricing (JOD)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Daily Rate *</label>
              <input type="number" value={form.dailyRate} onChange={(e) => updateField("dailyRate", e.target.value)} className={inputClass} placeholder="0" min={0} required />
            </div>
            <div>
              <label className={labelClass}>Weekly Rate</label>
              <input type="number" value={form.weeklyRate} onChange={(e) => updateField("weeklyRate", e.target.value)} className={inputClass} placeholder="Auto-calculated if empty" min={0} />
            </div>
            <div>
              <label className={labelClass}>Monthly Rate</label>
              <input type="number" value={form.monthlyRate} onChange={(e) => updateField("monthlyRate", e.target.value)} className={inputClass} placeholder="Auto-calculated if empty" min={0} />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Features</h2>
          <div className="flex flex-wrap gap-2">
            {COMMON_FEATURES.map((feat) => (
              <button
                key={feat}
                type="button"
                onClick={() => toggleFeature(feat)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  form.features.includes(feat)
                    ? "bg-[#0f4098] text-white border-[#0f4098]"
                    : "bg-white dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                {feat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFeature())}
              className={clsx(inputClass, "flex-1")}
              placeholder="Add custom feature..."
            />
            <button
              type="button"
              onClick={addCustomFeature}
              className="px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {/* Selected custom features */}
          {form.features.filter((f) => !COMMON_FEATURES.includes(f)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.features.filter((f) => !COMMON_FEATURES.includes(f)).map((feat) => (
                <span key={feat} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  {feat}
                  <button type="button" onClick={() => toggleFeature(feat)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Insurance */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Insurance & Registration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Insurance Policy #</label>
              <input type="text" value={form.insurancePolicy} onChange={(e) => updateField("insurancePolicy", e.target.value)} className={inputClass} placeholder="Policy number" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/fleet"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !form.carMake || !form.model || !form.dailyRate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#0f4098] hover:bg-blue-900 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Add to Fleet"}
          </button>
        </div>
      </form>
    </div>
  );
}
