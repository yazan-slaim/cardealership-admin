import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import SoldCar from "@/models/SoldCar"; // default export
import { Car } from "@/models/Car";
import { Client } from "@/models/Client";
import { Employee } from "@/models/Employee";

/**
 * GET  /api/madesale?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Returns monthly sale counts between the dates (defaults to last 12 months).
 */
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const currentDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setFullYear(currentDate.getFullYear() - 1);
    defaultStartDate.setMonth(currentDate.getMonth());
    defaultStartDate.setDate(1);

    const start = startDate
      ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
      : defaultStartDate;
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : currentDate;

    const salesData = await SoldCar.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return NextResponse.json(salesData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching sales data", error: error.message },
      { status: 400 }
    );
  }
}

/**
 * POST /api/madesale
 * {
 *   carId, buyerId, agentId,
 *   sale: { carTitle?, salePrice, paymentMethod, downPayment?, interestAPR?, termMonths?, adminNotes? },
 *   documents?: [<File ObjectId>]
 * }
 */
export async function POST(req) {
  await connectMongoDB();

  const body = await req.json();
  const { carId, buyerId, agentId, sale, documents = [] } = body;

  // Basic validation
  if (
    !carId ||
    !buyerId ||
    !agentId ||
    !sale?.salePrice ||
    !sale?.paymentMethod
  ) {
    return NextResponse.json(
      {
        message:
          "carId, buyerId, agentId, sale.salePrice and sale.paymentMethod are required.",
      },
      { status: 400 }
    );
  }
  for (const id of [carId, buyerId, agentId]) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "One or more IDs are invalid." },
        { status: 400 }
      );
    }
  }

  const session = await mongoose.startSession();
  try {
    let soldDoc;
    let daysInStock = 0;

    await session.withTransaction(async () => {
      // 1) Load car & guard against double-sale
      const car = await Car.findById(carId).session(session);
      if (!car) {
        const err = new Error("Car not found.");
        err.status = 404;
        throw err;
      }
      if (car.sold) {
        const err = new Error("Car already sold.");
        err.status = 409;
        throw err;
      }
      const existing = await SoldCar.findOne({ car: carId }).session(session);
      if (existing) {
        const err = new Error("Sale already exists for this car.");
        err.status = 409;
        throw err;
      }

      // 2) Compute age in stock
      const saleDate = new Date();
      const createdAt = car.createdAt || saleDate;
      daysInStock = Math.max(
        0,
        Math.ceil(
          (saleDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      // 3) Mark car sold + store sale date + daysInStock
      car.sold = true;
      car.SaleDate = saleDate;
      car.set("daysInStock", daysInStock, { strict: false }); // will work even if not in schema
      await car.save({ session });

      // 4) Create SoldCar record
      const [created] = await SoldCar.create(
        [
          {
            agent: agentId,
            car: carId,
            carTitle: sale.carTitle || car.title,
            buyer: buyerId,
            salePrice: Number(sale.salePrice),
            paymentMethod: sale.paymentMethod, // "Cash" | "Financed" | "Lease"
            downPayment:
              sale.paymentMethod === "Financed" ||
              sale.paymentMethod === "Lease"
                ? sale.downPayment != null
                  ? Number(sale.downPayment)
                  : undefined
                : undefined,
            interestAPR:
              sale.paymentMethod === "Financed"
                ? sale.interestAPR != null
                  ? Number(sale.interestAPR)
                  : undefined
                : undefined,
            termMonths:
              sale.termMonths != null ? Number(sale.termMonths) : undefined,
            documents, // Array<ObjectId of File> (already saved via your upload route)
            adminNotes: sale.adminNotes || "",
            notifications: {
              emailConfirmationSent: false,
              internalNotificationSent: false,
            },
            postSaleActions: {
              inventoryUpdated: true,
              followUpScheduled: null,
            },
          },
        ],
        { session }
      );
      soldDoc = created;

      // 5) Update Client (status + purchases)
      await Client.findByIdAndUpdate(
        buyerId,
        {
          $set: { status: "purchased" },
          $addToSet: { purchases: soldDoc._id },
          $pull: { interestedCars: carId }, // 👈 remove from interested list
        },
        { new: true, session }
      );

      // 6) Update Employee metrics
      let revenueContribution = 0;
      switch (sale.paymentMethod) {
        case "Cash":
          revenueContribution = Number(sale.salePrice) || 0;
          break;
        case "Financed":
        case "Lease":
          // immediate cash in (adjust to your policy)
          revenueContribution = Number(sale.downPayment) || 0;
          break;
        default:
          revenueContribution = Number(sale.salePrice) || 0;
      }

      await Employee.findByIdAndUpdate(
        agentId,
        {
          $inc: {
            totalSalesCount: 1,
            totalRevenueGenerated: revenueContribution,
          },
        },
        { new: true, session }
      );
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sale recorded successfully!",
        soldCar: soldDoc,
        daysInStock,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[MADE SALE ERROR]", err);
    const status = err.status || 400;
    return NextResponse.json(
      { message: err.message || "Error recording sale" },
      { status }
    );
  } finally {
    await session.endSession();
  }
}
