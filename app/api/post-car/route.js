import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";

export async function POST(req) {
  try {
    const { car, id } = await req.json();

    // Establish Secure Link
    await connectMongoDB();

    // Map marketing sub-documents to ensure NoSQL schema integrity
    const pagesObject = {
      luxuryPage: car.pages?.find((page) => page.title === "Luxury"),
      technologyPage: car.pages?.find((page) => page.title === "Technology"),
      comfortPage: car.pages?.find((page) => page.title === "Comfort"),
      performancePage: car.pages?.find((page) => page.title === "Performance"),
    };

    const carMongodbData = { ...car, pages: pagesObject };

    // ====================================================================
    // BRANCH A: ASSET UPDATE PROTOCOL
    // ====================================================================
    if (id) {
      const existingCar = await Car.findById(id);

      if (!existingCar) {
        return NextResponse.json(
          { error: "Asset not found in ledger." },
          { status: 404 },
        );
      }

      // Architectural Pivot: We map the new data onto the existing Mongoose document
      // and call .save(). This guarantees the primary Sabermetrics pre-save hook
      // fires perfectly, recalculating the Landed Cost and Precision Index.
      Object.assign(existingCar, carMongodbData);
      await existingCar.save();

      return NextResponse.json({
        success: true,
        message: "Asset updated and Sabermetrics recalculated.",
      });
    }
    // ====================================================================
    // BRANCH B: NEW ASSET INGESTION
    // ====================================================================
    else {
      const newCar = new Car(carMongodbData);
      await newCar.save();

      return NextResponse.json({
        success: true,
        message: "New asset ingested successfully.",
      });
    }
  } catch (error) {
    // Failsafe: Catch any pipeline rupture and return a clean JSON error
    console.error("🔥 [Ingestion Engine] System Failure:", error.message);
    return NextResponse.json(
      { error: "Data pipeline failure", details: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const { id, sold } = await req.json();
    await connectMongoDB();

    const existingCar = await Car.findById(id);

    if (!existingCar) {
      return NextResponse.json({ error: "Asset not found!" }, { status: 404 });
    }

    existingCar.sold = sold;
    await existingCar.save();

    return NextResponse.json({
      success: true,
      message: "Liquidity status updated successfully!",
    });
  } catch (error) {
    console.error("🔥 [Liquidation Engine] System Failure:", error.message);
    return NextResponse.json(
      { error: "Error updating sold status", details: error.message },
      { status: 500 },
    );
  }
}
