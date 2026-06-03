"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

// Styles
import { PageContainer, Button } from "./PostProduct/PostProductStyles";

// Constants
import {
  initialCarState,
  mainSections,
  TEXT_BLOCK,
  CONTENT_BLOCK,
} from "./PostProduct/Constants";

// Sections
import BasicInfo from "./PostProduct/Sections/BasicInfo";
import TechSpecs from "./PostProduct/Sections/TechSpecs";
import OptionsFeatures from "./PostProduct/Sections/OptionsFeatures";
import FinancialInfo from "./PostProduct/Sections/FinancialInfo";
import PageInfo from "./PostProduct/Sections/PageInfo";
import AssetsExtras from "./PostProduct/Sections/AssetsExtras";

// Lazy Loaded Components

export default function PostProductPage({ product }) {
  // State
  const [car, setCar] = useState(initialCarState);
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [carMakes, setCarMakes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);

  // Memoized explicit categories
  const phase1Fields = useMemo(() => [
    { key: "vinNumber", label: "VIN Number", type: "string" },
    { key: "carMake", label: "Car Make", type: "select" },
    { key: "model", label: "Model", type: "string" },
    { key: "trim", label: "Trim", type: "string" },
    { key: "year", label: "Year", type: "number" },
    { key: "color", label: "Color", type: "string" },
    { key: "condition", label: "Condition", type: "select" },
    { key: "mileage", label: "Mileage", type: "string" },
    { key: "titleStatus", label: "Title Status", type: "string" },
    { key: "importSource", label: "Import Source", type: "string" },
    { key: "auctionName", label: "Auction Name", type: "string" },
    { key: "paint", label: "Original Paint", type: "boolean" },
    { key: "carLicense", label: "Licensed", type: "boolean" },
    { key: "carCustoms", label: "Customs Cleared", type: "boolean" },
  ], []);

  const phase2Fields = useMemo(() => [
    { key: "bodyType", label: "Body Type", type: "string" },
    { key: "fuel", label: "Fuel Type", type: "string" },
    { key: "transmission", label: "Transmission", type: "string" },
    { key: "engineSize", label: "Engine Size (cc)", type: "number" },
    { key: "batterySize", label: "Battery Size (kWh)", type: "string" },
    { key: "regionalSpecs", label: "Regional Specs", type: "string" },
    { key: "tireSize", label: "Tire Size", type: "string" },
  ], []);

  const phase3Arrays = useMemo(() => ["specifications", "interiorOptions", "exteriorOptions"], []);

  const financialInformation = useMemo(() => [
    // --- 1. Acquisition (Costs) ---
    { key: "costs.auctionBidUsd", label: "[ACQ] Auction Bid (USD)", type: "number" },
    { key: "costs.auctionFeesUsd", label: "[ACQ] Auction Fees (USD)", type: "number" },
    { key: "costs.inlandTransportUsd", label: "[ACQ] Inland Transport (USD)", type: "number" },
    { key: "costs.oceanFreightUsd", label: "[ACQ] Ocean Freight (USD)", type: "number" },
    { key: "costs.exchangeRate", label: "[ACQ] Exchange Rate (to JOD)", type: "number" },
    { key: "costs.customsDutyJod", label: "[ACQ] Customs Duty (JOD)", type: "number" },
    { key: "costs.clearanceAgentJod", label: "[ACQ] Clearance Agent (JOD)", type: "number" },
    { key: "costs.storageDemurrageJod", label: "[ACQ] Storage/Demurrage (JOD)", type: "number" },
    { key: "costs.deliveryOrderJod", label: "[ACQ] Delivery Order (JOD)", type: "number" },

    // --- 2. Zarqa Reconditioning ---
    { key: "reconditioning.partsCost", label: "[RECON] Parts Cost", type: "number" },
    { key: "reconditioning.laborBodywork", label: "[RECON] Labor (Bodywork)", type: "number" },
    { key: "reconditioning.laborMechanic", label: "[RECON] Labor (Mechanic)", type: "number" },
    { key: "reconditioning.zarqaGatePass", label: "[RECON] Zarqa Gate Pass", type: "number" },
    { key: "reconditioning.towingAmman", label: "[RECON] Towing to Amman", type: "number" },
    { key: "reconditioning.actualReconSpend", label: "[RECON] Actual Spend", type: "number" },

    // --- 3. Overhead ---
    { key: "overhead.marketingTurboFees", label: "[OVERHEAD] Marketing Fees", type: "number" },
    { key: "overhead.showroomRentAllocation", label: "[OVERHEAD] Rent Allocation", type: "number" },
    { key: "overhead.salesCommission", label: "[OVERHEAD] Sales Commission", type: "number" },
    { key: "overhead.registrationFees", label: "[OVERHEAD] Registration Fees", type: "number" },

    // --- 4. Analytics & Valuation ---
    { key: "analytics.bookValueDepreciated", label: "[VALUATION] Book Value (Depreciated)", type: "number" },
    { key: "analytics.openSooqAverage", label: "[VALUATION] OpenSooq Average (TMV)", type: "number" },
    { key: "analytics.fahasScoreMultiplier", label: "[VALUATION] Fahas Multiplier", type: "number" },
    { key: "analytics.trueMarketValue", label: "[VALUATION] True Market Value", type: "number" },
    { key: "analytics.precisionIndex", label: "[VALUATION] Precision Index", type: "number" },

    // --- 5. High Level Financials ---
    { key: "financials.totalLandedCost", label: "New Total Landed Cost", type: "number", readOnly: true },
    { key: "financials.breakevenPrice", label: "Breakeven Price", type: "number", readOnly: true },
    { key: "financials.askingPrice", label: "Suggested Asking Price", type: "number" },
    { key: "financials.minManagerPrice", label: "Min Manager Price", type: "number", readOnly: true },

    // --- 6. Legacy / CRM Fields ---
    { key: "purchasePrice", label: "Legacy Purchase Price", type: "number" },
    { key: "shippingCost", label: "Legacy Shipping Cost", type: "number" },
    { key: "customsDuty", label: "Legacy Customs Duty", type: "number" },
    { key: "repairCost", label: "Legacy Repair Cost", type: "number" },
    { key: "totalLandedCost", label: "Legacy Total Landed Cost", type: "number", readOnly: true },
    { key: "price", label: "Final Display Price", type: "number" },
    { key: "pricePerMonth", label: "Price per Month", type: "number" },
    { key: "insurance", label: "Insurance terms", type: "string" },
    { key: "paymentMethod", label: "Payment Method", type: "string" },
  ], [car.totalLandedCost, car.marketAverage]);

  // Initial Data Fetch
  useEffect(() => {
    async function fetchCarMakes() {
      try {
        const response = await fetch("/api/carmake");
        const data = await response.json();
        setCarMakes(data);
      } catch (error) {
        console.error("Failed to fetch car makes", error);
      }
    }
    fetchCarMakes();
  }, []);

  // Sync Product to State
  useEffect(() => {
    if (product) {
      const filteredProduct = Object.keys(product).reduce((acc, key) => {
        if (!["_id", "__v", "createdAt", "updatedAt"].includes(key)) {
          acc[key] = product[key];
        }
        return acc;
      }, {});

      // Convert pages object to array if needed
      const pagesArray = Array.isArray(filteredProduct.pages)
        ? filteredProduct.pages
        : Object.keys(filteredProduct.pages || {}).map((key) => ({
            ...filteredProduct.pages[key],
            title: key,
          }));

      setCar({ ...filteredProduct, pages: pagesArray });
      if (filteredProduct.images) setImages(filteredProduct.images);
    }
  }, [product]);

  // Sync Images state to Car state
  useEffect(() => {
    setCar((prev) => ({ ...prev, images: images }));
  }, [images]);

  // Unit Economics Auto-Calculation
  useEffect(() => {
    const purchase = Number(car.purchasePrice) || 0;
    const shipping = Number(car.shippingCost) || 0;
    const customs = Number(car.customsDuty) || 0;
    const repair = Number(car.repairCost) || 0;
    const totalLanded = purchase + shipping + customs + repair;
    
    if (car.totalLandedCost !== totalLanded) {
      setCar(prev => ({ ...prev, totalLandedCost: totalLanded }));
    }
  }, [car.purchasePrice, car.shippingCost, car.customsDuty, car.repairCost, car.totalLandedCost]);

  // Handlers (using useCallback for performance)
  const handleInputChange = useCallback(
    (e, pageIndex, blockIndex, field, subField) => {
      const { type, checked, value } = e.target;
      const inputValue = type === "checkbox" ? checked : value;

      setCar((prevCar) => {
        const updatedCar = { ...prevCar };
        if (pageIndex !== null) {
          const updatedPages = [...updatedCar.pages];
          if (field === "splide" && blockIndex !== null) {
            const updatedSplide = [...updatedPages[pageIndex].splide];
            updatedSplide[blockIndex][subField] =
              type === "number" ? parseInt(inputValue) : inputValue;
            updatedPages[pageIndex].splide = updatedSplide;
          } else if (blockIndex !== null) {
            const updatedBlocks = [...updatedPages[pageIndex].blocks];
            if (subField) {
              updatedBlocks[blockIndex][subField] =
                type === "number" ? parseInt(inputValue) : inputValue;
            } else {
              updatedBlocks[blockIndex][field] =
                type === "number" ? parseInt(inputValue) : inputValue;
            }
            updatedPages[pageIndex].blocks = updatedBlocks;
          } else {
            updatedPages[pageIndex][field] =
              type === "number" ? parseInt(inputValue) : inputValue;
          }
          updatedCar.pages = updatedPages;
        } else {
          const finalVal = type === "number" && inputValue !== "" ? parseFloat(inputValue) : inputValue;
          
          if (field.includes(".")) {
            const [parent, child] = field.split(".");
            updatedCar[parent] = { ...updatedCar[parent], [child]: finalVal };
          } else {
            updatedCar[field] = finalVal;
          }

          if (field === "condition" && prevCar._pricingIntel?.tiers?.[inputValue]) {
            const tier = prevCar._pricingIntel.tiers[inputValue];
            updatedCar.price = tier.suggestedPrice || updatedCar.price;
            updatedCar.minimumAcceptedPrice = tier.priceFloor || updatedCar.minimumAcceptedPrice;
            updatedCar.pricePerMonth = Math.ceil((tier.suggestedPrice || 0) / 36) || updatedCar.pricePerMonth;

            updatedCar._pricingIntel = {
              ...prevCar._pricingIntel,
              suggestedPrice: tier.suggestedPrice,
              priceFloor: tier.priceFloor,
              priceCeiling: tier.priceCeiling,
              projectedProfit: tier.projectedProfit,
              profitMarginPct: prevCar.totalLandedCost > 0
                ? Math.round((tier.projectedProfit / prevCar.totalLandedCost) * 10000) / 100
                : prevCar._pricingIntel.profitMarginPct
            };
          }
        }
        return updatedCar;
      });
    },
    [],
  );

  const handleAddCategory = useCallback((partkey) => {
    setCar((prev) => ({ ...prev, [partkey]: [...prev[partkey], ""] }));
  }, []);

  const handleRemoveCategory = useCallback((partkey, index) => {
    setCar((prev) => {
      const updated = [...prev[partkey]];
      updated.splice(index, 1);
      return { ...prev, [partkey]: updated };
    });
  }, []);

  const handleCategoryChange = useCallback((partkey, index, value) => {
    setCar((prev) => ({
      ...prev,
      [partkey]: prev[partkey].map((v, i) => (i === index ? value : v)),
    }));
  }, []);

  const addBlock = useCallback((pageIndex, type) => {
    setCar((prev) => {
      const updatedPages = [...prev.pages];
      const newBlock = {
        title: "",
        description: "",
        ...(type === CONTENT_BLOCK && { enum: "center", image: "" }),
      };
      updatedPages[pageIndex].blocks = [
        ...updatedPages[pageIndex].blocks,
        newBlock,
      ];
      return { ...prev, pages: updatedPages };
    });
  }, []);

  const removeBlock = useCallback((pageIndex, blockIndex) => {
    setCar((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[pageIndex].blocks = updatedPages[pageIndex].blocks.filter(
        (_, i) => i !== blockIndex,
      );
      return { ...prev, pages: updatedPages };
    });
  }, []);

  const addSplide = useCallback((pageIndex) => {
    setCar((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[pageIndex].splide = [
        ...updatedPages[pageIndex].splide,
        { title: "", image: "", description: "" },
      ];
      return { ...prev, pages: updatedPages };
    });
  }, []);

  const removeSplide = useCallback((pageIndex, slideIndex) => {
    setCar((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[pageIndex].splide = updatedPages[pageIndex].splide.filter(
        (_, i) => i !== slideIndex,
      );
      return { ...prev, pages: updatedPages };
    });
  }, []);

  const updateImagesOrder = useCallback((newImages) => {
    setImages(newImages);
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const [scanSessionId, setScanSessionId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const startRemoteScan = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'}/api/scan/session`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.sessionId) {
        setScanSessionId(data.sessionId);
        setIsPolling(true);
      }
    } catch (err) {
      alert("Failed to start scan session.");
    }
  };

  const fetchVinDetails = useCallback(async (vin) => {
    const vinToUse = vin || car.vinNumber;
    if (!vinToUse || vinToUse.length !== 17) {
      alert("Please enter a valid 17-character VIN.");
      return;
    }

    setIsLoadingVin(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vin-decode?vin=${vinToUse}`,
      );
      const data = await response.json();

      if (response.ok && data.success && data.vehicle) {
        setCar((prev) => ({
          ...prev,
          ...data.vehicle,
          vinNumber: vinToUse,
        }));
      } else {
        alert(data.error || "Failed to decode VIN.");
      }
    } catch (error) {
      console.error("VIN fetch error:", error);
      alert("Error reaching VIN service.");
    } finally {
      setIsLoadingVin(false);
    }
  }, [car.vinNumber]);

  const fetchModelLookup = useCallback(async (query) => {
    if (!query || query.trim().length < 3) {
      alert("Please enter a valid search (e.g. 'Corolla LE 2020')");
      return;
    }

    setIsLoadingModel(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/model-lookup?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (response.ok && data.success && data.vehicle) {
        setCar((prev) => ({
          ...prev,
          ...data.vehicle,
        }));
      } else {
        alert(data.error || "Model lookup failed.");
      }
    } catch (error) {
      console.error("Model lookup error:", error);
      alert("Error reaching model lookup service.");
    } finally {
      setIsLoadingModel(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isPolling && scanSessionId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'}/api/scan/session/${scanSessionId}`);
          const data = await res.json();
          if (data.status === 'completed' && data.vin) {
            setCar(prev => ({ ...prev, vinNumber: data.vin }));
            setIsPolling(false);
            setScanSessionId(null);
            fetchVinDetails(data.vin);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPolling, scanSessionId, fetchVinDetails]);

  const handleAIAutofill = async () => {
    try {
      setIsAutofilling(true);
      const res = await fetch("/api/autofill-car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carData: car }),
      });
      const data = await res.json();
      if (data.success && data.car) {
        setCar(data.car);
        alert("✨ AI successfully populated the data center!");
      } else {
        alert("Autofill failed: " + data.error);
      }
    } catch (err) {
      alert("Network error during AI autofill.");
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!product;
      const url = isEditing
        ? `/api/cars/${product._id}`
        : "/api/cars/post-car";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car),
      });

      if (response.ok) {
        alert(isEditing ? "Car updated successfully!" : "Car posted successfully!");
      } else {
        alert("Error saving car.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

  const uploadImages = async (ev) => {
    const files = ev.target?.files;
    if (!files?.length) return;
    setIsUploading(true);
    const data = new FormData();
    for (const file of files) data.append("file", file);
    try {
      const res = await fetch("/api/uploadMultipleImages", {
        method: "POST",
        body: data,
      });
      const responseData = await res.json();
      setImages((old) => [...old, ...responseData.links]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImage = async (ev, pageIndex, blockIndex, fieldname) => {
    const file = ev.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/uploadOneImage", {
        method: "POST",
        body: data,
      });
      const responseData = await res.json();
      if (fieldname === "logoImage") {
        setCar((prev) => ({ ...prev, logoImage: responseData.link }));
      } else {
        setCar((prev) => {
          const updated = { ...prev };
          if (pageIndex !== null && blockIndex !== null) {
            updated.pages[pageIndex][fieldname][blockIndex].image =
              responseData.link;
          }
          return updated;
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const postProduct = async () => {
    try {
      const res = await fetch("/api/post-car", {
        method: "POST",
        body: JSON.stringify({ id: product?._id, car }),
      });
      const answer = await res.json();
      alert("Changes Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving changes.");
    }
  };

  const handleCarSeerData = useCallback((parsedData) => {
    setCar((prev) => ({
      ...prev,
      vinNumber: parsedData.vin || prev.vinNumber,
      mileage: parsedData.mileage?.toString() || prev.mileage,
      color: parsedData.color || prev.color,
      titleStatus: parsedData.titleStatus || prev.titleStatus,
      importSource: parsedData.importSource || prev.importSource,
      auctionName: parsedData.auctionName || prev.auctionName,
      carSeerHistory: {
        ...prev.carSeerHistory,
        clean:
          parsedData.cleanTitle !== null
            ? parsedData.cleanTitle
            : prev.carSeerHistory?.clean,
        aiSummary: parsedData.aiSummary || prev.carSeerHistory?.aiSummary,
        carseerRating:
          parsedData.carseerRating || prev.carSeerHistory?.carseerRating,
        previousOwners:
          parsedData.previousOwners || prev.carSeerHistory?.previousOwners,
        primaryDamage:
          parsedData.primaryDamage || prev.carSeerHistory?.primaryDamage,
        annualLicenseFee:
          parsedData.annualLicenseFee || prev.carSeerHistory?.annualLicenseFee,
      },
    }));

    if (parsedData.vin) {
      fetchVinDetails(parsedData.vin);
    }
  }, [fetchVinDetails]);

  const renderSection = () => {
    switch (activeIndex) {
      case 0: // Phase 1: Identity & Provenance
        return (
          <BasicInfo
            car={car}
            carMakes={carMakes}
            isLoadingVin={isLoadingVin}
            isLoadingModel={isLoadingModel}
            fields={phase1Fields}
            handleInputChange={handleInputChange}
            fetchVinDetails={fetchVinDetails}
            fetchModelLookup={fetchModelLookup}
            handleCarSeerData={handleCarSeerData}
            startRemoteScan={startRemoteScan}
          />
        );
      case 1: // Phase 2: Technical Specs
        return (
          <TechSpecs
            car={car}
            fields={phase2Fields}
            handleInputChange={handleInputChange}
          />
        );
      case 2: // Phase 3: Equipment & Features
        return (
          <OptionsFeatures
            car={car}
            arrayParts={phase3Arrays}
            handleCategoryChange={handleCategoryChange}
            handleRemoveCategory={handleRemoveCategory}
            handleAddCategory={handleAddCategory}
          />
        );
      case 3: // Phase 4: Unit Economics
        return (
          <FinancialInfo
            car={car}
            financialInformation={financialInformation}
            handleInputChange={handleInputChange}
          />
        );
      case 4: // Phase 5: Media & Marketing
        return (
          <>
            <PageInfo
              car={car}
              activeSubIndex={activeSubIndex}
              setActiveSubSection={setActiveSubIndex}
              handleInputChange={handleInputChange}
              uploadImage={uploadImage}
              addBlock={addBlock}
              removeBlock={removeBlock}
              addSplide={addSplide}
              removeSplide={removeSplide}
              TEXT_BLOCK={TEXT_BLOCK}
              CONTENT_BLOCK={CONTENT_BLOCK}
            />
            <AssetsExtras
              car={car}
              images={images}
              isUploading={isUploading}
              handleCategoryChange={handleCategoryChange}
              handleRemoveCategory={handleRemoveCategory}
              handleAddCategory={handleAddCategory}
              handleInputChange={handleInputChange}
              uploadImages={uploadImages}
              uploadImage={uploadImage}
              handleRemoveImage={handleRemoveImage}
              updateImagesOrder={updateImagesOrder}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <h2 style={{ color: "#0f172a", marginBottom: "24px", fontSize: '1.8rem', fontWeight: 800 }}>
        Data Entry Pipeline
      </h2>
      <div
        style={{
          display: 'flex',
          marginBottom: "24px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {mainSections.map((section, index) => (
          <Button
            key={index}
            active={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          >
            {section.title}
          </Button>
        ))}
      </div>
      <div>{renderSection()}</div>
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px"
        }}
      >
        <Button
          type="button"
          onClick={handleAIAutofill}
          disabled={isAutofilling}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "16px 24px",
            borderRadius: "0px",
            cursor: "pointer",
          }}
        >
          {isAutofilling ? "AI is thinking..." : "Auto-Fill Empty Fields"}
        </Button>
        <button
          onClick={postProduct}
          style={{
            padding: "16px 48px",
            fontSize: "1rem",
            fontWeight: 700,
            background: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "0px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          {product?._id ? "UPDATE VEHICLE" : "PUBLISH VEHICLE"}
        </button>
      </div>

      {/* REMOTE SCAN MODAL */}
      {scanSessionId && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 9999, padding: 20 
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: '0px', maxWidth: 400, textAlign: 'center', border: '2px solid #0f172a', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Scan with Mobile</h2>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: 24 }}>
              Scan this QR code with your phone camera to launch the remote scanner. 
              The VIN will auto-populate here once detected.
            </p>
            
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: '0px', marginBottom: 24, border: '1px solid #cbd5e1' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent((process.env.NEXT_PUBLIC_ADMIN_URL || (typeof window !== 'undefined' ? window.location.origin : '')) + '/scan/' + scanSessionId)}`} 
                alt="Scan QR" 
                style={{ width: 200, height: 200 }}
              />
            </div>

            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
              SESSION ID: {scanSessionId}
            </div>

            <button 
              onClick={() => { setScanSessionId(null); setIsPolling(false); }}
              style={{ width: '100%', padding: '12px', borderRadius: '0px', border: '1px solid #0f172a', background: 'transparent', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}

    </PageContainer>
  );
}
