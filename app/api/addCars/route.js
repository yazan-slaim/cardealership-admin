import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Car } from "@/models/Car";

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export async function POST(req) {
  await connectMongoDB();

  // Array to hold 100 car objects
  const carsToAdd = Array.from({ length: 100 }, (_, i) => ({
    title: `Car ${i + 1}`,
    carMake: "Toyota",
    Featured: false,
    model: `Model ${i + 1}`,
    trim: "Standard",
    year: 2022,
    color: "Blue",
    bodyType: "Sedan",
    condition: "New",
    mileage: "0 km",
    fuel: "Petrol",
    transmission: "Automatic",
    carLicense: true,
    insurance: "Full",
    carCustoms: false,
    regionalSpecs: "GCC",
    engineSize: 2.5,
    specifications: ["ABS", "Airbags"],
    tireSize: "17 inches",
    interiorOptions: ["Leather seats", "Bluetooth"],
    exteriorOptions: ["Alloy wheels", "LED lights"],
    paymentMethod: "Cash",
    price: 25000,
    pricePerMonth: 500,
    vinNumber: `VIN${i + 1}`,
    paint: false,
    images: [`/images/car${i + 1}.jpg`],
    logoImage: `/images/logo${i + 1}.jpg`,
    sold: Math.random() < 0.5, // Random boolean for sold status
    SaleDate: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)), // Random date between 2022 and 2024
    pages: {
      luxuryPage: {
        intro: "Luxury Car Intro",
        h2Title: "Luxury Features",
        blocks: [
          {
            title: "Luxury Block 1",
            description: "Description for luxury block 1",
            image: "/images/luxury1.jpg",
          },
          {
            title: "Luxury Block 2",
            description: "Description for luxury block 2",
            image: "/images/luxury2.jpg",
          },
        ],
      },
      technologyPage: {
        intro: "Technology Car Intro",
        h2Title: "Technology Features",
        splide: [
          {
            title: "Tech Slide 1",
            image: "/images/tech1.jpg",
            description: "Description for tech slide 1",
          },
        ],
        blocks: [
          {
            title: "Tech Block 1",
            description: "Description for tech block 1",
            image: "/images/tech1.jpg",
          },
        ],
      },
      comfortPage: {
        intro: "Comfort Car Intro",
        h2Title: "Comfort Features",
        blocks: [
          {
            title: "Comfort Block 1",
            description: "Description for comfort block 1",
            image: "/images/comfort1.jpg",
          },
        ],
      },
      performancePage: {
        intro: "Performance Car Intro",
        h2Title: "Performance Features",
        blocks: [
          {
            title: "Performance Block 1",
            description: "Description for performance block 1",
            image: "/images/performance1.jpg",
          },
        ],
      },
    },
    lastPageDescription: "This is the last page description",
    extra: ["Additional feature 1", "Additional feature 2"],
  }));

  try {
    // Insert all cars into the database
    await Car.insertMany(carsToAdd);
    return NextResponse.json({
      status: "success",
      message: "100 cars added successfully.",
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error.message });
  }
}
