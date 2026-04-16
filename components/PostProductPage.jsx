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
import OptionsFeatures from "./PostProduct/Sections/OptionsFeatures";
import FinancialInfo from "./PostProduct/Sections/FinancialInfo";
import PageInfo from "./PostProduct/Sections/PageInfo";
import AssetsExtras from "./PostProduct/Sections/AssetsExtras";

// Lazy Loaded Components
const VinScanner = dynamic(() => import("./VinScanner"), {
  ssr: false,
  loading: () => <p style={{ color: "white" }}>Loading Scanner...</p>,
});

export default function PostProductPage({ product }) {
  // State
  const [car, setCar] = useState(initialCarState);
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [carMakes, setCarMakes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Memoized derived data to prevent unnecessary re-renders of sub-sections
  const arrayParts = useMemo(
    () =>
      Object.keys(car).filter(
        (key) =>
          Array.isArray(car[key]) &&
          !["pages", "images", "extra"].includes(key),
      ),
    [car],
  );

  const stringParts = useMemo(
    () =>
      Object.keys(car).filter(
        (key) =>
          typeof car[key] === "string" &&
          ![
            "logoImage",
            "paymentMethod",
            "insurance",
            "lastPageDescription",
            "carMake",
            "vinNumber",
            "importSource",
            "titleStatus",
            "auctionName",
          ].includes(key),
      ),
    [car],
  );

  // vinNumber is handled specially in BasicInfo
  const baseStringParts = useMemo(
    () => ["vinNumber", ...stringParts],
    [stringParts],
  );

  const numberParts = useMemo(
    () =>
      Object.keys(car).filter(
        (key) =>
          typeof car[key] === "number" &&
          !["price", "pricePerMonth", "year"].includes(key),
      ),
    [car],
  );

  const booleanParts = useMemo(
    () => Object.keys(car).filter((key) => typeof car[key] === "boolean"),
    [car],
  );

  const financialInformation = useMemo(
    () => [
      { key: "price", value: car.price, label: "Price", type: "number" },
      {
        key: "pricePerMonth",
        value: car.pricePerMonth,
        label: "Price per Month",
        type: "number",
      },
      {
        key: "insurance",
        value: car.insurance,
        label: "Insurance",
        type: "string",
      },
      {
        key: "paymentMethod",
        value: car.paymentMethod,
        label: "Payment Method",
        type: "string",
      },
    ],
    [car.price, car.pricePerMonth, car.insurance, car.paymentMethod],
  );

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
          updatedCar[field] =
            type === "number" ? parseInt(inputValue) : inputValue;
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

  const fetchVinDetails = async (vin) => {
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

      // ✅ FIX 1: Make sure we check for data.vehicle
      if (response.ok && data.success && data.vehicle) {
        // ✅ FIX 2: Spread data.vehicle into your state, NOT data!
        setCar((prev) => ({
          ...prev,
          ...data.vehicle,
          vinNumber: vinToUse,
        }));

        // Trigger Market Oracle Scraper
        try {
          const oracleResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/market-intelligence`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                // ✅ FIX 3: Target the nested data.vehicle fields!
                make: data.vehicle.carMake,
                model: data.vehicle.model,
                year: data.vehicle.year,
              }),
            },
          );

          const oracleData = await oracleResponse.json();
          if (oracleData.average) {
            setCar((prev) => ({ ...prev, marketAverage: oracleData.average }));
          }
        } catch (err) {
          console.error("Market Oracle Error:", err);
        }
      } else {
        alert(data.error || "Failed to decode VIN.");
      }
    } catch (err) {
      alert("Network Error fetching VIN details.");
    } finally {
      setIsLoadingVin(false);
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
  }, []);

  const renderSection = () => {
    switch (activeIndex) {
      case 0:
        return (
          <BasicInfo
            car={car}
            carMakes={carMakes}
            isLoadingVin={isLoadingVin}
            showScanner={showScanner}
            stringParts={baseStringParts}
            numberParts={numberParts}
            booleanParts={booleanParts}
            handleInputChange={handleInputChange}
            fetchVinDetails={fetchVinDetails}
            setShowScanner={setShowScanner}
            handleCarSeerData={handleCarSeerData}
          />
        );
      case 1:
        return (
          <OptionsFeatures
            car={car}
            arrayParts={arrayParts}
            handleCategoryChange={handleCategoryChange}
            handleRemoveCategory={handleRemoveCategory}
            handleAddCategory={handleAddCategory}
          />
        );
      case 2:
        return (
          <FinancialInfo
            financialInformation={financialInformation}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
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
        );
      case 4:
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <h2 style={{ color: "white", marginBottom: "30px" }}>
        Dealership Data Center
      </h2>
      <div
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "15px",
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
          marginTop: "50px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={postProduct}
          style={{
            padding: "15px 40px",
            fontSize: "1rem",
            background: "#f0f0f0",
            color: "black",
            borderRadius: "10px",
          }}
        >
          SUBMIT CHANGES
        </Button>
      </div>
    </PageContainer>
  );
}
