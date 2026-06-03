"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car, Plus, Upload, Loader2, Save } from "lucide-react";

export default function AddCarPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    carMake: "",
    model: "",
    year: "",
    vinNumber: "",
    price: "",
    mileage: "",
    color: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/post-car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ car: formData }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to inventory or show success
        router.push("/inventory");
      } else {
        alert("Error adding car: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting car:", error);
      alert("Failed to submit car.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Vehicle</h1>
          <p className="text-slate-500 mt-2">Enter the vehicle details to ingest a new asset into your inventory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Vehicle Specifications
            </CardTitle>
            <CardDescription>Primary identification details for the vehicle.</CardDescription>
          </CardHeader>
          
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Display Title (Optional)</label>
              <Input 
                name="title"
                placeholder="e.g. 2024 Toyota Camry LE" 
                value={formData.title} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">VIN Number</label>
              <Input 
                name="vinNumber"
                placeholder="17-character VIN" 
                required 
                value={formData.vinNumber} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Make</label>
              <Input 
                name="carMake"
                placeholder="e.g. Toyota" 
                required 
                value={formData.carMake} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Model</label>
              <Input 
                name="model"
                placeholder="e.g. Camry" 
                required 
                value={formData.model} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Year</label>
              <Input 
                name="year"
                type="number"
                placeholder="e.g. 2024" 
                required 
                value={formData.year} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Exterior Color</label>
              <Input 
                name="color"
                placeholder="e.g. Midnight Black" 
                value={formData.color} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mileage</label>
              <Input 
                name="mileage"
                placeholder="e.g. 15,000 km" 
                value={formData.mileage} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Target Retail Price</label>
              <Input 
                name="price"
                type="number"
                placeholder="e.g. 25000" 
                required 
                value={formData.price} 
                onChange={handleChange} 
              />
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Asset...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save & Ingest Vehicle
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
