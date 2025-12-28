import { Box } from "@/public/StyledComponents";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
import { Enquiry } from "@/models/Enquiry";
import CarMakeSalesChart from "@/components/mainpage/CarMakeSalesChart";
import CarSalesChart from "@/components/mainpage/CarSalesChart";
import CarLeadsChart from "@/components/mainpage/CarLeadChart";
import TopSection from "@/components/mainpage/Top-Section";
import MiddleSection from "@/components/mainpage/Middle-Section";
import LowerSection from "@/components/mainpage/Lower-Section";
export default async function Home() {
  await connectMongoDB();

  // Get the total number of cars and enquiries
  const mongocars = await Car.find({}).sort({ createdAt: -1 });
  const numberOfCars = mongocars.length;
  const enquiries = await Enquiry.find({});
  const numberOfEnquiries = enquiries.length;

  // Get the number of cars sold by car make using MongoDB's aggregation
  const carMakeSales = await Car.aggregate([
    {
      $match: { sold: true }, // Only count cars that have been sold
    },
    {
      $group: {
        _id: "$carMake", // Group by car make
        count: { $sum: 1 }, // Count the number of cars for each car make
      },
    },
    {
      $sort: { count: -1 }, // Optional: Sort by count in descending order
    },
  ]);

  return (
    <div>
      <TopSection/>
      <MiddleSection/>
      <LowerSection/>
      {/*
      <Box>Cars in stock: {numberOfCars}</Box>
      <Box>Leads: {numberOfEnquiries}</Box>
      <Box>
        <CarLeadsChart
          numberOfCars={numberOfCars}
          numberOfEnquiries={numberOfEnquiries}
        />
      </Box>
      <Box>
        <CarMakeSalesChart carMakeSales={carMakeSales} />
      </Box>
      <Box>
        <CarSalesChart />
      </Box>
*/}
    </div>
  );
}
