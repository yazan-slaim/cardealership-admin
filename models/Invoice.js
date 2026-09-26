import mongoose, { Schema, model, models } from "mongoose";

const lineItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new Schema(
  {
    dealershipId: {
      type: Schema.Types.ObjectId,
      ref: "Dealership",
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    renter: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Line items
    lineItems: [lineItemSchema],

    // Totals
    subtotal: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    taxAmount: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 },
    depositApplied: { type: Number, default: 0, min: 0 },
    amountDue: { type: Number, default: 0, min: 0 },

    // Payment
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
      index: true,
    },
    paidAmount: { type: Number, default: 0, min: 0 },
    paidAt: Date,
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", ""],
      default: "",
    },
    dueDate: Date,

    adminNotes: String,
  },
  { timestamps: true }
);

// Indexes
invoiceSchema.index({ dealershipId: 1, status: 1 });
invoiceSchema.index({ dealershipId: 1, createdAt: -1 });
invoiceSchema.index({ booking: 1 }, { unique: true });

// Auto-generate invoice number before saving
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const count = await mongoose.models.Invoice.countDocuments({
      dealershipId: this.dealershipId,
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
    });
    this.invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(3, "0")}`;
  }

  // Auto-compute amountDue
  if (this.totalAmount != null) {
    this.amountDue = this.totalAmount - (this.depositApplied || 0) - (this.paidAmount || 0);
  }

  next();
});

export const Invoice = models?.Invoice || model("Invoice", invoiceSchema);
