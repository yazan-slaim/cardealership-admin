import { connectMongoDB } from "@/lib/mongodb";
import { Fleet } from "@/models/Fleet";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDealershipScope } from "@/lib/getDealershipScope";
import FleetPage from "@/components/fleet/FleetPage";

export default async function FleetPageRoute() {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const scopeFilter = await getDealershipScope(session);

  const vehicles = await Fleet.find(
    { ...scopeFilter, isActive: true },
    "title carMake model year color bodyType dailyRate weeklyRate monthlyRate status images licensePlate mileage seats transmission fuel features createdAt"
  ).sort({ createdAt: -1 });

  const serialized = vehicles.map((v) => ({
    ...v.toObject(),
    _id: v._id.toString(),
    createdAt: v.createdAt?.toISOString(),
  }));

  return <FleetPage collection={serialized} />;
}
