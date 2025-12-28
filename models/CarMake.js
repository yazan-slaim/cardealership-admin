import { model, models, Schema } from "mongoose";

export const CarMakeSchema = new Schema(
  {
    title: String,
    logoURL: String,
  },
  {
    timestamps: true,
  }
);

export const CarMake = models?.CarMake || model("CarMake", CarMakeSchema);
