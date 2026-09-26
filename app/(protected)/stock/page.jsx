import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
import ProductsPage from "@/components/ProductsPage";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDealershipScope } from "@/lib/getDealershipScope";

export default async function page() {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const scopeFilter = await getDealershipScope(session);

  const mongocars = await Car.find(
    scopeFilter,
    "title price images createdAt carMake sold"
  ).sort({ createdAt: -1 });

  const serializedCars = mongocars.map((car) => ({
    ...car.toObject(),
    _id: car._id.toString(),
    createdAt: car.createdAt.toISOString(), //
  }));

  return <ProductsPage collection={serializedCars} />;
}
