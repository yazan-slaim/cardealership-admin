import mongoose, { Schema, model, models } from "mongoose";

const fleetSchema = new Schema(
  {
    dealershipId: {
      type: Schema.Types.ObjectId,
      ref: "Dealership",
      required: true,
      index: true,
    },
    title: { type: String, trim: true }, // auto-generated: "2024 Toyota Camry"
    carMake: { type: String, trim: true },
    model: { type: String, trim: true },
    trim: { type: String, trim: true },
    year: Number,
    color: { type: String, trim: true },
    bodyType: {
      type: String,
      enum: [
        "Sedan",
        "SUV",
        "Hatchback",
        "Coupe",
        "Convertible",
        "Pickup",
        "Van",
        "Luxury",
        "Sports",
        "Other",
      ],
    },
    licensePlate: { type: String, trim: true },
    vinNumber: { type: String, trim: true },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      default: "Automatic",
    },
    fuel: {
      type: String,
      enum: ["Petrol", "Diesel", "Hybrid", "Electric"],
      default: "Petrol",
    },
    engineSize: Number,
    seats: { type: Number, default: 5 },
    mileage: { type: Number, default: 0 }, // current odometer reading

    images: [String],

    features: [String], // GPS, Bluetooth, Sunroof, Backup Camera, etc.

    // Pricing
    dailyRate: { type: Number, required: true, min: 0 },
    weeklyRate: { type: Number, min: 0 },
    monthlyRate: { type: Number, min: 0 },

    // Availability
    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "reserved", "retired"],
      default: "available",
      index: true,
    },
    maintenanceNotes: String,
    nextServiceDate: Date,

    // Insurance & Registration
    insuranceExpiry: Date,
    registrationExpiry: Date,
    insurancePolicy: { type: String, trim: true },

    // Flags
    Featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound indexes for common queries
fleetSchema.index({ dealershipId: 1, status: 1 });
fleetSchema.index({ dealershipId: 1, bodyType: 1 });
fleetSchema.index({ dealershipId: 1, dailyRate: 1 });

// Auto-generate title before saving
fleetSchema.pre("save", function (next) {
  if (!this.title && this.year && this.carMake && this.model) {
    this.title = `${this.year} ${this.carMake} ${this.model}`.trim();
  }
  next();
});

export const Fleet = models?.Fleet || model("Fleet", fleetSchema);
