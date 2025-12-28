import { model, models, Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    title: String,
    author: String,
    stars: Number,
    review: String,
  },
  {
    timestamps: true,
  }
);

export const Review = models?.Review || model("Review", ReviewSchema);
