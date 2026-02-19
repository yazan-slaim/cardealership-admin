import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "US" },
  },
  { _id: false },
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
      default: "",
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    address: {
      type: addressSchema,
      default: () => ({}),
    },

    preferredContactMethod: {
      type: String,
      enum: ["phone", "email", "whatsapp"],
      default: "phone",
    },

    leadSource: {
      type: String,
      default: "",
    },

    interestedCars: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
      default: [],
    },

    enquiries: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enquiry" }],
      default: [],
    },

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

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    tasks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
      default: [],
    },

    notes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
      default: [],
    },

    purchases: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoldCar" }],
      default: [],
    },

    files: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
      default: [],
    },
  },
  { timestamps: true },
);

clientSchema.index({ email: 1, phoneNumber: 1 });

export const Client =
  mongoose.models.Client || mongoose.model("Client", clientSchema);
