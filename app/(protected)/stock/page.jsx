import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
import ProductsPage from "@/components/ProductsPage";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function page() {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const dealershipId = session?.user?.dealershipId;
  const filter = dealershipId ? { dealershipId } : {};

  const mongocars = await Car.find(
    filter,
    "title price images createdAt carMake sold"
  ).sort({ createdAt: -1 });

  const serializedCars = mongocars.map((car) => ({
    ...car.toObject(),
    _id: car._id.toString(),
    createdAt: car.createdAt.toISOString(), //
  }));

  return <ProductsPage collection={serializedCars} />;
}
