import { connectMongoDB } from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDealershipScope } from "@/lib/getDealershipScope";
import InvoicesPage from "@/components/invoices/InvoicesPage";

export default async function InvoicesPageRoute() {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const scopeFilter = await getDealershipScope(session);

  const invoices = await Invoice.find(scopeFilter)
    .populate("booking", "bookingNumber pickupDate returnDate totalAmount status")
    .populate("renter", "fullName email phoneNumber")
    .sort({ createdAt: -1 })
    .lean();

  const serialized = invoices.map((inv) => ({
    ...inv,
    _id: inv._id.toString(),
    booking: inv.booking
      ? { ...inv.booking, _id: inv.booking._id.toString(), pickupDate: inv.booking.pickupDate?.toISOString(), returnDate: inv.booking.returnDate?.toISOString() }
      : null,
    renter: inv.renter ? { ...inv.renter, _id: inv.renter._id.toString() } : null,
    createdAt: inv.createdAt?.toISOString(),
    dueDate: inv.dueDate?.toISOString() || null,
    paidAt: inv.paidAt?.toISOString() || null,
  }));

  return <InvoicesPage invoices={serialized} />;
}
