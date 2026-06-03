import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
import { Enquiry } from "@/models/Enquiry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Dashboard from "@/components/mainpage/Dashboard";

export default async function Home() {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const dealershipId = session?.user?.dealershipId;
  const filter = dealershipId ? { dealershipId } : {};

  const numberOfCars = await Car.countDocuments(filter);
  const numberOfEnquiries = await Enquiry.countDocuments(filter);

  return <Dashboard />;
}
