import { connectMongoDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDealershipScope } from "@/lib/getDealershipScope";
import { Dealership } from "@/models/Dealership";
import Dashboard from "@/components/mainpage/Dashboard";
import RentalDashboard from "@/components/mainpage/RentalDashboard";

export default async function Home() {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const scopeFilter = await getDealershipScope(session);

  // Determine business type
  let businessType = "dealership";
  if (session?.user?.dealershipId) {
    const dealership = await Dealership.findById(session.user.dealershipId)
      .select("businessType")
      .lean();
    if (dealership?.businessType) businessType = dealership.businessType;
  }

  if (businessType === "rental") {
    return <RentalDashboard />;
  }

  return <Dashboard />;
}
