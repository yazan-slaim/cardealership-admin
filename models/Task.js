import mongoose, { Schema, model, models } from "mongoose";

export const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    relatedCar: {
      type: Schema.Types.ObjectId,
      ref: "Car",
    },
    relatedClient: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Task = models?.Task || model("Task", TaskSchema);
