import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
export async function GET(req) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const matchQuery = { sold: true };
  if (startDate && endDate) {
    matchQuery.SaleDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const carMakeSales = await Car.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$carMake",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return new Response(JSON.stringify(carMakeSales), { status: 200 });
}
