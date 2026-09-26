import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    dealershipId: {
      type: Schema.Types.ObjectId,
      ref: "Dealership",
      index: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "lead", "task", "alert"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    link: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = models?.Notification || model("Notification", NotificationSchema);
