import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDealershipId } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employeeId = session.user.id;
    const dealershipId = await getDealershipId();
    let list = await Notification.find({ employeeId, dealershipId }).sort({ createdAt: -1 }).lean();

    // Auto-seeding default demo notifications for immediate visual feedback
    if (list.length === 0) {
      const mockNotifications = [
        {
          employeeId,
          dealershipId,
          title: "New Lead Assigned",
          message: "Jordan Mitchell has submitted an inquiry for a Toyota Camry.",
          type: "lead",
          link: "/enquiries",
          read: false,
        },
        {
          employeeId,
          dealershipId,
          title: "Task Due Tomorrow",
          message: "Follow up with client John Doe regarding their payment status.",
          type: "task",
          link: "/enquiries",
          read: false,
        },
        {
          employeeId,
          dealershipId,
          title: "Welcome to MOTIO CRM",
          message: "You can manage vehicle inventory, track customer leads, and review marketing analytics.",
          type: "info",
          link: "/market",
          read: false,
        },
      ];
      await Notification.insertMany(mockNotifications);
      list = await Notification.find({ employeeId, dealershipId }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employeeId = session.user.id;
    const body = await req.json();
    const { id, all } = body;

    if (all) {
      await Notification.updateMany({ employeeId, read: false }, { read: true });
    } else if (id) {
      await Notification.findOneAndUpdate({ _id: id, employeeId }, { read: true });
    } else {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to update notification status" }, { status: 500 });
  }
}
