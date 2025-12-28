import { model, models, Schema } from "mongoose";

const FeaturedCarSchema = new Schema(
  {
    title: String,
    images: [String],
    color: String,
    price: Number,
    mileage: String,
    year: Number,
  },
  {
    timestamps: true,
  }
);

export const FeaturedCar =
  models?.FeaturedCar || model("FeaturedCar", FeaturedCarSchema);
