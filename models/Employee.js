import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    dealershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealership', required: false, index: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    phoneNumber: String,
    address: String,
    profileImageUrl: String,
    role: { type: String, default: "agent" },
    isActive: { type: Boolean, default: true },
    hireDate: { type: Date, default: Date.now },
    totalSalesCount: { type: Number, default: 0 },
    totalRevenueGenerated: { type: Number, default: 0 },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    inviteToken: { type: String, default: null },
    inviteTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
