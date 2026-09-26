import mongoose, { Schema, model, models } from "mongoose";

const extraSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g. "GPS", "Child Seat", "Full Insurance"
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    dealershipId: {
      type: Schema.Types.ObjectId,
      ref: "Dealership",
      required: true,
      index: true,
    },
    bookingNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    fleet: {
      type: Schema.Types.ObjectId,
      ref: "Fleet",
      required: true,
    },
    renter: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    // Scheduled dates
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    // Actual dates (filled on pickup/return)
    actualPickupDate: Date,
    actualReturnDate: Date,

    pickupLocation: { type: String, trim: true },
    returnLocation: { type: String, trim: true },

    // Pricing
    rateType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    rateAmount: { type: Number, required: true, min: 0 },
    totalDays: { type: Number, min: 1 },
    subtotal: { type: Number, min: 0 },
    deposit: { type: Number, default: 0, min: 0 },
    extras: [extraSchema],
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, min: 0 },
    lateFee: { type: Number, default: 0, min: 0 },

    // Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "overdue",
      ],
      default: "pending",
      index: true,
    },

    // Vehicle condition at pickup/return
    pickupMileage: Number,
    returnMileage: Number,
    pickupFuelLevel: {
      type: String,
      enum: ["Full", "3/4", "Half", "1/4", "Empty", ""],
      default: "",
    },
    returnFuelLevel: {
      type: String,
      enum: ["Full", "3/4", "Half", "1/4", "Empty", ""],
      default: "",
    },
    damageNotes: String,
    pickupPhotos: [String],
    returnPhotos: [String],

    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", ""],
      default: "",
    },

    // Documents & notes
    documents: [{ type: Schema.Types.ObjectId, ref: "File" }],
    adminNotes: String,
  },
  { timestamps: true }
);

// Indexes for availability queries and common lookups
bookingSchema.index({ fleet: 1, pickupDate: 1, returnDate: 1 });
bookingSchema.index({ renter: 1, createdAt: -1 });
bookingSchema.index({ dealershipId: 1, status: 1 });
bookingSchema.index({ dealershipId: 1, createdAt: -1 });

// Auto-generate booking number before saving
bookingSchema.pre("save", async function (next) {
  if (!this.bookingNumber) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const count = await mongoose.models.Booking.countDocuments({
      dealershipId: this.dealershipId,
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
    });
    this.bookingNumber = `BK-${dateStr}-${String(count + 1).padStart(3, "0")}`;
  }

  // Auto-compute totalDays if not set
  if (!this.totalDays && this.pickupDate && this.returnDate) {
    const diffMs = this.returnDate.getTime() - this.pickupDate.getTime();
    this.totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  // Auto-compute subtotal
  if (this.rateAmount && this.totalDays) {
    this.subtotal = this.rateAmount * this.totalDays;
  }

  // Auto-compute totalAmount
  if (this.subtotal != null) {
    const extrasTotal = (this.extras || []).reduce((sum, e) => sum + (e.price || 0), 0);
    this.totalAmount =
      this.subtotal + extrasTotal - (this.discount || 0) + (this.lateFee || 0);
  }

  next();
});

export const Booking = models?.Booking || model("Booking", bookingSchema);
