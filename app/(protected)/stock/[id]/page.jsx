"use client";
import React, { useState, useEffect,useRef } from 'react';
import { Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useParams } from 'next/navigation';
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { usePathname } from 'next/navigation';
import h337 from "heatmap.js";
import html2canvas from "html2canvas";
import styled from "styled-components";


// Register the necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const viewsData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Number of Views",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const genderData = {
  labels: ["Male", "Female", "Other"],
  datasets: [
    {
      label: "Gender Distribution",
      data: [60, 35, 5],
      backgroundColor: [
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 99, 132, 0.5)",
        "rgba(255, 206, 86, 0.5)",
      ],
    },
  ],
};

const ageGroupData = {
  labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
  datasets: [
    {
      label: "Age Group Distribution",
      data: [15, 30, 25, 20, 10],
      backgroundColor: [
        "rgba(75, 192, 192, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(153, 102, 255, 0.5)",
        "rgba(255, 159, 64, 0.5)",
        "rgba(54, 162, 235, 0.5)",
      ],
    },
  ],
};

const engagementData = {
  labels: ["Average Time on Page", "Bounce Rate", "Scroll Depth"],
  datasets: [
    {
      label: "Engagement Metrics",
      data: [3, 50, 75],
      backgroundColor: [
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(255, 159, 64, 0.5)",
      ],
    },
  ],
};

const interestData = {
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  datasets: [
    {
      label: "Site Activity",
      data: [10, 20, 30, 40, 50, 80, 30],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
const StyledLabel = styled.label`
  color: white;
  display: block;
  margin-bottom: 5px;
  min-width: 100px;
`;
const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 175px;
  height: 175px;
  cursor: pointer;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  color: white;
  margin: 10px;
  background: ${(props) =>
    props.background ? `url(${props.background})` : "rgba(0, 0, 0, 0.2)"};
  background-size: cover;
  background-position: center;
`;

export default function Page() {
  const { id } = useParams(); 
  console.log("Fetched ID:", id)
  console.log("this is id fetched", id)
  const carname=""
  const [isFeatured, setIsFeatured] = useState();

  const [chartData, setChartData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [genderChartData, setGenderChartData] = useState(null);
  const [ageChartData, setAgeChartData] = useState(null);
  const [car,setCar]= useState()
  const [newPrice, setNewPrice] = useState();
    const [isUploading, setIsUploading] = useState(false);
  

  
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch(`/api/featuredcar/fetchfeatured?id=${id}`);
        const data = await response.json();
    
        if (data.success) {
          console.log('Featured status:', data.featured);
          setIsFeatured(data.featured); 
          console.log(isFeatured) // You can now access the featured status
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching featured status:', error);
      }
    }
    async function fetchCar() {
      try {
        const response = await fetch(`/api/Car/fetchCar?id=${id}`);
        const data = await response.json();
    
        if (data.success) {
          console.log('Featured status:', data.fetchedCar);
          setCar(data.fetchedCar); 
          setNewPrice(data.fetchedCar.price)
          console.log(car) // You can now access the featured status
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching featured status:', error);
      }
    }
    

      const fetchDemographics = async () => {
      try {
        const response = await fetch('/api/analytics/demographics');
        const data = await response.json();
  
        if (data.success) {
          // Convert gender data to Pie Chart format
          setGenderChartData({
            labels: Object.keys(data.genderData),
            datasets: [
              {
                label: 'Users by Gender',
                data: Object.values(data.genderData),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          });
  
          // Convert age data to Pie Chart format
          setAgeChartData({
            labels: Object.keys(data.ageData),
            datasets: [
              {
                label: 'Users by Age Group',
                data: Object.values(data.ageData),
                backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF'],
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching demographics data:', error);
      }
    };
  
    fetchDemographics();
    fetchFeatured()
    fetchCar()
  }, []);
  const pathname = usePathname()
  console.log(pathname)
  const eventBuffer = useRef([]); // Stores interactions before sending
const lastMoveTime = useRef(0);
const heatmapInstance = useRef(null);
const heatmapContainer = useRef(null);
const [heatmapVisible, setHeatmapVisible] = useState(false);
const [screenshotData, setScreenshotData] = useState(null);
const screenshotContainer = useRef(null);
const [screenshotWidth, setScreenshotWidth] = useState(null);
const [screenshotHeight, setScreenshotHeight] = useState(null);

const fetchHeatmapData = async () => {
  try {
    const response = await fetch(`/api/heatmap/getheatmap?page=${pathname}`);
    if (!response.ok) throw new Error("Failed to fetch heatmap data");

    const heatmapData = await response.json();
      
    if (heatmapInstance.current) {
      heatmapInstance.current.setData({
        max: 10,
        data: heatmapData.map(({ x, y }) => ({
          x: (x / 100) * window.innerWidth, // Convert from percentage to pixels
          y: (y / 100) * screenshotHeight,
          value: 5,
        })),
      });
    }
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
  }
};

useEffect(() => {
  if (heatmapContainer.current) {
    heatmapContainer.current.style.position = "absolute";
    heatmapContainer.current.style.top = "0";
    heatmapContainer.current.style.left = "0";
    heatmapContainer.current.style.height = `${screenshotHeight}px`;

    heatmapContainer.current.style.width = "100vw";
    heatmapContainer.current.style.pointerEvents = "none";
    heatmapContainer.current.style.zIndex = "10000";
  }
}, []);
useEffect(() => {
  if (heatmapVisible && heatmapContainer.current) {
    // Initialize heatmap only when container is available
    heatmapInstance.current = h337.create({
      container: heatmapContainer.current,
      radius: 30,
      maxOpacity: 0.6,
      minOpacity: 0.1,
      blur: 0.75,
    });
    heatmapContainer.current.style.position = "absolute";


    fetchHeatmapData(); // Fetch data when heatmap is shown
  }

  return () => {
    if (heatmapInstance.current) {
      heatmapInstance.current.setData({ data: [] }); // Clear data on unmount
      heatmapInstance.current = null;
    }
  };
}, [heatmapVisible]);

const normalizeCoords = (x, y) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    x: (x / width) * 100,  // Normalize to percentage of screen width
    y: (y / height) * 100  // Normalize to percentage of screen height
  };
};

/*
const sendData = async () => {
  if (eventBuffer.current.length === 0) return;

  try {
      console.log("Batch sent:", JSON.stringify(eventBuffer.current, null, 2));

    const response = await fetch("/api/heatmap/postheatmap", {
      method: "POST",
      body: JSON.stringify(eventBuffer.current),
    });

    if (!response.ok) {
      console.error("Failed to send heatmap data");
    }
  } catch (error) {
    console.error("Error sending heatmap data:", error);
  }

  eventBuffer.current = []; // Clear buffer after sending
};
*/
/*
const handleInteraction = (type, x, y) => {
  const { x: normX, y: normY } = normalizeCoords(x, y);
  eventBuffer.current.push({ type, x: normX, y: normY, pathname });

  if (eventBuffer.current.length >= 10) sendData(); // Send every 10 interactions
};

const handleClick = (e) => handleInteraction("click", e.clientX, e.clientY);

const handleMouseMove = (e) => {
  const now = Date.now();
  if (now - lastMoveTime.current < 500) return; // Limit movement tracking
  lastMoveTime.current = now;
  handleInteraction("move", e.clientX, e.clientY);
};

useEffect(() => {
  window.addEventListener("click", handleClick);
  window.addEventListener("mousemove", handleMouseMove);
  
  const interval = setInterval(sendData, 5000); // Log every 5s
  return () => {
    clearInterval(interval);
    window.removeEventListener("click", handleClick);
    window.removeEventListener("mousemove", handleMouseMove);
  };
}, []);
*/
const takeScreenshot = async () => {
  if (!heatmapVisible) return;

  try {
    const canvas = await html2canvas(document.documentElement, { // Capture full page
      allowTaint: true,
      useCORS: true,
      scale: window.devicePixelRatio, // Improves quality
    });

    const imageData = canvas.toDataURL("image/png");
    setScreenshotData(imageData);
  } catch (error) {
    console.error("Error taking screenshot:", error);
  }
};
const takeExternalScreenshot = async (url) => {
  try {
    const response = await fetch(`/api/takescreenshot?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (data.image) {
      setScreenshotData(data.image); // Set the image to display in UI
      
      // Create an image object to get width and height
      const img = new Image();
      img.src = data.image;
      
      img.onload = () => {
        // Store the height and width of the screenshot
        const screenshotWidth = img.width;
        const screenshotHeight = img.height;
        console.log(`Screenshot Width: ${screenshotWidth}, Height: ${screenshotHeight}`);
        
        // If needed, store them in state or use them elsewhere
        setScreenshotWidth(screenshotWidth);
        setScreenshotHeight(screenshotHeight);

        console.log(screenshotWidth )
        console.log(screenshotHeight )

      };
    }
  } catch (error) {
    console.error("Error taking screenshot:", error);
  }
};
console.log(screenshotWidth)
console.log(screenshotHeight)
  useEffect(() => {
    if (id) {
      const fetchPageViews = async () => {
        try {
          const response = await fetch(`/api/analytics/idviews?id=${id}`);
          const data = await response.json();

          if (data.success) {
            const sortedData = data.result.data.sort((a, b) => parseInt(a.date, 10) - parseInt(b.date, 10));

            const transformedData = {
              labels: sortedData.map((entry) => {
                const dateStr = entry.date.toString();
                return `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}/${dateStr.slice(0, 4)}`;
              }),
              datasets: [
                {
                  label: `Page Views for ${carname}`,
                  data: sortedData.map((entry) => entry.pageViews),
                  borderColor: 'rgba(75,192,192,1)',
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  tension: 0.4,
                },
              ],
            };

            setChartData(transformedData);
          }
        } catch (error) {
          console.error('Error fetching chart data:', error);
        }
      };

      const fetchEngagementMetrics = async () => {
        try {
          const response = await fetch(`/api/analytics/engagement?id=${id}`);
          const data = await response.json();

          if (data.success) {
            const sortedData = data.result.data.sort((a, b) => parseInt(a.date, 10) - parseInt(b.date, 10));

            setEngagementData({
              labels: sortedData.map((entry) => {
                const dateStr = entry.date.toString();
                return `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}/${dateStr.slice(0, 4)}`;
              }),
              datasets: [
                {
                  label: `Avg Time on Page (seconds)`,
                  data: sortedData.map((entry) => entry.avgTimeOnPage),
                  borderColor: 'rgba(255,99,132,1)',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  tension: 0.4,
                },
                {
                  label: `Bounce Rate (%)`,
                  data: sortedData.map((entry) => entry.bounceRate),
                  borderColor: 'rgba(54,162,235,1)',
                  backgroundColor: 'rgba(54,162,235,0.2)',
                  tension: 0.4,
                },
                {
                  label: `Scroll Depth`,
                  data: sortedData.map((entry) => entry.scrollDepth),
                  borderColor: 'rgba(255,206,86,1)',
                  backgroundColor: 'rgba(255,206,86,0.2)',
                  tension: 0.4,
                },
              ],
            });
          }
        } catch (error) {
          console.error('Error fetching engagement data:', error);
        }
      };
     
      fetchPageViews();
      fetchEngagementMetrics();
    }
  }, [id, carname]);
  async function toggleFeatured(){
    try{
      let response = await fetch ("/api/featuredcar/featuredtoggle",{
        method: "POST",
        body: JSON.stringify({
          id:id,
        })
      })
      const data = await response.json()
      console.log(data.featured)
      if (data.success){
        setIsFeatured(data.featured)
      }
    }catch (error){
      console.error("Error toggling featured  status:", error)
    }
  }
  const updatePrice = async () => {
    if (!newPrice) return;
    try {
      const res = await fetch(`/api/Car/adjustPrice`, {
        method: 'POST',
        body: JSON.stringify({ carId: id, price: newPrice }),
      });
  
      if (res.ok) {
       
        setNewPrice('');
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };
  async function uploadImage(ev, pageIndex, blockIndex, fieldname) {
    const file = ev.target.files[0];
    if (!file) {
      return;
    }
    setIsUploading(true);
  
    const data = new FormData();
    data.append("file", file);
  
    const response = await fetch("/api/uploadOneImage", {
      method: "POST",
      body: data,
    });
  
    if (!response.ok) {
      setIsUploading(false);
      return;
    }
  
    const responseData = await response.json();
    const imageUrl = responseData.link;
  
    // Get image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setScreenshotWidth(img.width);
      setScreenshotHeight(img.height);
      URL.revokeObjectURL(img.src); // Clean up memory
  
      if (fieldname === "logoImage") {
        setScreenshotData(imageUrl);
      } else {
        handleInputChangeImage(imageUrl, pageIndex, blockIndex, fieldname, "image");
      }
      
      setIsUploading(false);
    };
  }
  
  
  return (
    <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
  <div>Body Type: {car?.bodyType}</div>
  <div>Car Make: {car?.carMake}</div>
  <div>Color: {car?.color}</div>
  <div>Condition: {car?.condition}</div>
  <div>Model: {car?.model}</div>
  <div>Mileage: {car?.mileage}</div>
  <div>Price: {car?.price}</div>
  <div>Title: {car?.title}</div>
  <div>Sold: {car?.sold ? 'Yes' : 'No'}</div>
</div>

<Typography variant="h4" component="h2">
        adjust price
      </Typography>
      <input
  type="number"
  value={newPrice}
  onChange={(e) => setNewPrice(e.target.value)}
  placeholder="Enter new price"
  style={{color:"black"}}
/>
<button onClick={updatePrice}>Update Price</button>


      <ToggleButtonGroup exclusive>
      <ToggleButton
  value="featured"
  selected={isFeatured}
  onClick={toggleFeatured}
  sx={{
    background: isFeatured ? "green" : "red",
    color: "white",
    "&:hover": {
      background: "white",
      color: isFeatured ? "green" : "red", // Maintain visibility
    },
  }}
>
  {isFeatured ? "Featured" : "Unfeatured"}
</ToggleButton>

      </ToggleButtonGroup>

      <Typography variant="h4" component="h2">
        upload screenshot
      </Typography>
      <div>
              <StyledLabel htmlFor="logoImage">Logo Image</StyledLabel>

              <UploadLabel background={screenshotData}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-upload"
                >
                  <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                  <line x1="12" y1="2" x2="12" y2="13"></line>
                </svg>
                <div>Add Image</div>
                <input
                  type="file"
                  id="logoImage"
                  onChange={(e) => uploadImage(e, null, null, "logoImage")}
                  className="hidden"
                />{" "}
              </UploadLabel>
            </div>
      <Typography variant="h4" component="h2">
        Views Graph
      </Typography>
      
      <div style={{ marginTop: '20px' }}>
        {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
      </div>
      <Typography variant="h4" component="h2">
        Views vs Sales
      </Typography>
      <Line data={viewsData} options={options} />
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
    <div style={{ width: '40%' }}>
      <h3>Gender Distribution</h3>
      {genderChartData ? <Pie data={genderChartData} /> : <p>Loading gender data...</p>}
    </div>
    
    <div style={{ width: '40%' }}>
      <h3>Age Group Distribution</h3>
      {ageChartData ? <Pie data={ageChartData} /> : <p>Loading age data...</p>}
    </div>
  </div>
      <Pie data={ageGroupData} />
      <Typography variant="h4" component="h2">
        Engagement Metrics
      </Typography>
      <div style={{ marginTop: '20px' }}>
        <h2>Engagement Metrics</h2>
        {engagementData ? <Line data={engagementData} /> : <p>Loading engagement metrics...</p>}
      </div>
            <Typography variant="h4" component="h2">
        Interest Graph (Heatmap or Bar Chart)
      </Typography>
      <Bar data={interestData} options={options} />
      <Typography variant="h4" component="h2">
        Sales Trends (for Sold Cars)
      </Typography>
      <Typography variant="body1">
        Similar cars typically sell within 30-45 days of listing.
      </Typography>

      <div style={{ position: "relative", overflow:"hidden",minHeight:"200vh" }}>
      {/* Take Screenshot Button */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "200px",
          background: "rgba(255, 0, 0, 0.8)",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          transition: "0.3s",
          zIndex:"100"
        }}
        onClick={() => takeExternalScreenshot(`http://localhost:3000${pathname}`)}
      >
        Take Screenshot
      </button>

      {/* Toggle Heatmap Button */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          transition: "0.3s",
          marginRight: "10px",
          zIndex:"100"

        }}
        onClick={() => setHeatmapVisible((prev) => !prev)}
      >
        {heatmapVisible ? "Hide Heatmap" : "Show Heatmap"}
      </button>

      <img
      src={screenshotData}
      alt="Screenshot"

      style={{
        display: "block",
        position:"relative",
        width: "auto",
        height: "auto",
        width: "100vw",
      }}
      ></img>
    

  <div
    style={{
        position:"relative",
      height: `${screenshotHeight}px`, // Set dynamic height
      width: "100vw",   // Set dynamic width
      background: `url(${screenshotData})`, // Set screenshot as background
      backgroundSize: "cover",         // Ensure the image covers the div
      backgroundPosition: "center",    // Center the background image
      backgroundRepeat: "no-repeat",   // Avoid repeating the background image
    }}
  />


   
   

<div
  ref={heatmapContainer}
  style={{
    position: "absolute !important", // Forces absolute position
    top: "0",
    left: "0",
    width: "100vw",
    height: `${screenshotHeight}px`,
    pointerEvents: "none",
    zIndex: 10000,
  }}
/>





    </div>
    </Box>
  );
}
