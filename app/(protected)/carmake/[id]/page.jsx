import { connectMongoDB } from "@/lib/mongodb";
import { CarMake } from "@/models/CarMake";
import EditCarMake from "@/components/EditCarMake";

export default async function page({ params }) {
  await connectMongoDB();
  let carMake = await CarMake.findById(params.id).lean();
  carMake = carMake ? JSON.parse(JSON.stringify(carMake)) : null;

  return <EditCarMake carMake={carMake} />;
}
