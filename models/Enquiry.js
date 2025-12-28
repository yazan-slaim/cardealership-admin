import { model, models, Schema } from "mongoose";

const EnquirySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["sell_car", "general", "car_enquiry", "test_drive"],
      required: true,
    },

    client: { type: Schema.Types.ObjectId, ref: "Client" }, 
    car: { type: Schema.Types.ObjectId, ref: "Car" },       

    firstName: String,
    lastName: String,
    email: { type: String, lowercase: true, trim: true },
    contactNumber: String,
    message: String,

    carDetails: {
      make: String,
      model: String,
      year: Number,
      mileage: Number,
      condition: String,
    },

    testDriveDate: Date,

    status: { 
      type: String, 
      enum: ["new", "in_progress", "closed"],
      default: "new",
    },

    cleared: { type: Boolean, default: false },
    note: String,

    handledBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

export const Enquiry =
  models?.Enquiry || model("Enquiry", EnquirySchema);
