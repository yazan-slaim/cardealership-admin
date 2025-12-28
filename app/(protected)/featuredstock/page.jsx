import FeaturedComponent from "@/components/FeaturedComponent";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
export default async function page() {
  await connectMongoDB();
  const mongocars = await Car.find(
    {},
    "title images color price mileage year createdAt"
  ).sort({ createdAt: -1 });
  console.log(mongocars);
  return <FeaturedComponent stock={mongocars} />;
}
