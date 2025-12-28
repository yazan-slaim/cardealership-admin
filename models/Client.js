import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: "US" },
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    address: addressSchema,

    preferredContactMethod: {
      type: String,
      enum: ["phone", "email", "whatsapp"],
      default: "phone",
    },

    leadSource: { type: String },

    interestedCars: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Car" }
    ],

    // UPDATED — use correct spelling & model reference
    enquiries: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Enquiry" }
    ],

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "interested",
        "negotiating",
        "purchased",
        "lost",
      ],
      default: "new",
    },

    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },

    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoldCar" }],
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  },
  { timestamps: true }
);

// Optional performance optimization
clientSchema.index({ email: 1, phoneNumber: 1 });

export const Client =
  mongoose.models.Client || mongoose.model("Client", clientSchema);
