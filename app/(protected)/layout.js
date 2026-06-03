import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CRMLayout from "@/components/layout/CRMLayout";

export default async function ProtectedLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/sign-in");

  return (
    <CRMLayout user={session.user}>
      {children}
    </CRMLayout>
  );
}
