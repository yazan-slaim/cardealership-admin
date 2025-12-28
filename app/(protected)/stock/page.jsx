import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
import ProductsPage from "@/components/ProductsPage";

export default async function page() {
  await connectMongoDB();

  const mongocars = await Car.find(
    {},
    "title price images createdAt carMake sold"
  ).sort({ createdAt: -1 });

  const serializedCars = mongocars.map((car) => ({
    ...car.toObject(),
    _id: car._id.toString(),
    createdAt: car.createdAt.toISOString(), //
  }));

  return <ProductsPage collection={serializedCars} />;
}
