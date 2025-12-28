import { model, models, Schema } from "mongoose";

const InteractionSchema = new Schema({
  x: Number,
  y: Number,
  type: { type: String, default: "move" },
  timestamp: Number
});

export const HeatMapSchema = new Schema(
  {
    page: String, // Store which page this batch belongs to
    interactions: [InteractionSchema], // Store an array of interactions in a batch
    batchTimestamp: { type: Number, default: Date.now },// Store when the batch was saved
  }
);

export const HeatMap = models?.HeatMap || model("HeatMap", HeatMapSchema);
