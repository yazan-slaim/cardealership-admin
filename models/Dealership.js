import mongoose from 'mongoose';

const dealershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  businessType: {
    type: String,
    enum: ['dealership', 'rental'],
    default: 'dealership',
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  customDomain: {
    type: String,
    unique: true,
    sparse: true, // sparse because multiple dealerships might not have custom domains
    lowercase: true,
    trim: true,
  },
  logo: {
    type: String, // URL to logo
  },
  themeColors: {
    primary: { type: String, default: '#ef4444' }, // default red-500
    secondary: { type: String, default: '#f97316' }, // default orange-500
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String,
    whatsapp: String,
  },
  // Rental-specific defaults (only used when businessType === 'rental')
  rentalConfig: {
    currency: { type: String, default: 'JOD' },
    lateFeePerDay: { type: Number, default: 0 },
    depositPercent: { type: Number, default: 20 },
    businessHours: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '20:00' },
    },
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Dealership = mongoose.models.Dealership || mongoose.model('Dealership', dealershipSchema);
