import mongoose, { Schema, models, model } from "mongoose";

const activitySchema = new Schema(
  {
    dealershipId: {
      type: Schema.Types.ObjectId,
      ref: "Dealership",
      index: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: false,
      index: true,
    },

    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: false,
      index: true,
    },

    type: {
      type: String,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    performedBy: {
      type: Schema.Types.ObjectId,
      refPath: "performedByModel",
      default: null,
    },

    performedByModel: {
      type: String,
      enum: ["Employee", "Client"],
      default: null,
    },

    source: {
      type: String,
      enum: ["employee", "client", "system"],
      default: "system",
    },
  },
  { timestamps: true }
);

activitySchema.index({ client: 1, createdAt: -1 });
activitySchema.index({ carId: 1, createdAt: -1 });

export const Activity = models?.Activity || model("Activity", activitySchema);
export default Activity;
