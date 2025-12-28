import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
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
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
  },
  { timestamps: true }
);

export const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
