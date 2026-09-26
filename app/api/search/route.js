import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
import { Enquiry } from "@/models/Enquiry";
import { Client } from "@/models/Client";
import { getDealershipScope } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim() === "") {
      return NextResponse.json({ cars: [], enquiries: [], clients: [] });
    }

    await connectMongoDB();

    const regexQuery = { $regex: q.trim(), $options: "i" };
    const scopeFilter = await getDealershipScope();

    // Run queries in parallel
    const [cars, enquiries, clients] = await Promise.all([
      Car.find({
        ...scopeFilter,
        $or: [
          { title: regexQuery },
          { carMake: regexQuery },
          { model: regexQuery },
          { vinNumber: regexQuery },
        ],
      })
        .limit(5)
        .select("title carMake model price images vinNumber")
        .lean(),

      Enquiry.find({
        ...scopeFilter,
        $or: [
          { firstName: regexQuery },
          { lastName: regexQuery },
          { email: regexQuery },
          { contactNumber: regexQuery },
        ],
      })
        .limit(5)
        .select("firstName lastName email contactNumber status carDetails")
        .lean(),

      Client.find({
        ...scopeFilter,
        $or: [
          { fullName: regexQuery },
          { email: regexQuery },
          { phoneNumber: regexQuery },
        ],
      })
        .limit(5)
        .select("fullName email phoneNumber status")
        .lean(),
    ]);

    return NextResponse.json({
      cars,
      enquiries,
      clients,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
