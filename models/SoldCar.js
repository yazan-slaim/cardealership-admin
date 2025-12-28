import mongoose, { Schema, Types } from "mongoose";

const soldCarSchema = new Schema(
  {
    agent: { type: Types.ObjectId, ref: "Employee", required: true },

    car: { type: Types.ObjectId, ref: "Car", required: true },
    carTitle: String,

    buyer: { type: Types.ObjectId, ref: "Client", required: true },

    salePrice: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Financed", "Lease"],
      default: "Cash",
    },

    // only required when Financed
    downPayment: {
      type: Number,
      min: 0,
      required: function () {
        return this.paymentMethod === "Financed";
      },
    },
    interestAPR: {
      type: Number,
      min: 0,
      max: 100,
      required: function () {
        return this.paymentMethod === "Financed";
      },
    },
    termMonths: { type: Number, min: 1 }, // optional

    // reference your File docs (like client.files)
    documents: [{ type: Types.ObjectId, ref: "File" }],

    // keep flags/meta
    notifications: {
      emailConfirmationSent: { type: Boolean, default: false },
      internalNotificationSent: { type: Boolean, default: false },
    },
    postSaleActions: {
      inventoryUpdated: { type: Boolean, default: false },
      followUpScheduled: Date,
    },

    adminNotes: String,
  },
  { timestamps: true }
);
soldCarSchema.index({ car: 1 }, { unique: true });

soldCarSchema.index({ createdAt: 1 });
soldCarSchema.index({ agent: 1, createdAt: -1 });
soldCarSchema.index({ buyer: 1 });

export default mongoose.models.SoldCar ||
  mongoose.model("SoldCar", soldCarSchema);
