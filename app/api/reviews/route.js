import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

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

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: Sorting by creation date

    const totalReviews = await Review.countDocuments();

    return NextResponse.json({ reviews, totalReviews }, { status: 200 });
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
    const deletedReview = await Review.findByIdAndDelete(id);
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
