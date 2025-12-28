"use client";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // Call the API to add 100 cars when the component mounts
    const addCars = async () => {
      try {
        const response = await fetch("/api/addCars", {
          method: "POST",
        });
        const data = await response.json();
        console.log(data); // Logs the response from the API
      } catch (error) {
        console.error("Error adding cars:", error);
      }
    };

    addCars();
  }, []);

  return (
    <div>
      <button>add-100 cars</button>
    </div>
  );
}
