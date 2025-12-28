import { model, models, Schema } from "mongoose";

const contentBlockSchema = new Schema({
  title: String,
  description: String,
  image: String,
  enum: String,
});

const textBlockSchema = new Schema({
  title: String,
  description: String,
});

const slideSchema = new Schema({
  title: String,
  image: String,
  description: String,
});

const pageSchema = new Schema({
  intro: String,
  h2Title: String,
  blocks: [contentBlockSchema, textBlockSchema],
});

const technologyPageSchema = new Schema({
  intro: String,
  h2Title: String,
  splide: [slideSchema],
  blocks: [contentBlockSchema, textBlockSchema],
});

export const CarSchema = new Schema(
  {
    title: String,
    carMake: String,
    Featured: Boolean,
    model: String,
    trim: String,
    year: Number,
    color: String,
    bodyType: String,
    condition: String,
    mileage: String,
    fuel: String,
    transmission: String,
    carLicense: Boolean,
    insurance: String,
    carCustoms: Boolean,
    regionalSpecs: String,
    engineSize: Number,
    specifications: [String],
    tireSize: String,
    interiorOptions: [String],
    exteriorOptions: [String],
    paymentMethod: String,
    price: Number,
    daysInStock: { type: Number, default: 0 },
    pricePerMonth: Number,
    vinNumber: String,
    NewArrival: Boolean,
    SpecialDeal: Boolean,
    paint: Boolean,
    images: [String],
    logoImage: String,
    SaleDate: Date,
    sold: {
      type: Boolean,
      default: false,
    },
    pages: {
      luxuryPage: pageSchema,
      technologyPage: technologyPageSchema,
      comfortPage: pageSchema,
      performancePage: pageSchema,
    },
    lastPageDescription: String,
    extra: [String],
  },
  {
    timestamps: true,
  }
);

export const Car = models?.Car || model("Car", CarSchema);
