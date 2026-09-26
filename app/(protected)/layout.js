import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CRMLayout from "@/components/layout/CRMLayout";
import { connectMongoDB } from "@/lib/mongodb";
import { Dealership } from "@/models/Dealership";

export default async function ProtectedLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/sign-in");

  let dealership = null;
  if (session.user?.dealershipId) {
    await connectMongoDB();
    dealership = await Dealership.findById(session.user.dealershipId).lean();
  }

  return (
    <CRMLayout user={session.user} dealership={dealership}>
      {children}
    </CRMLayout>
  );
}
