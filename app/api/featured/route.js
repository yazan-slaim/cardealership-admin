import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Review from "@/models/Review";

export async function POST(req) {
  try {
    const { title, author, stars, review } = await req.json();
    await connectMongoDB();
    const newReview = await Review.create({ title, author, stars, review });
    await newReview.save();
    return NextResponse.json(
      { message: "Review created successfully!", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating review", error },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const reviews = await Reviw.find({});
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectMongoDB();
    const deletedReview = await Reviw.findByIdAndDelete(id);
    if (!deletedReview) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Review deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting review", error },
      { status: 500 }
    );
  }
}
