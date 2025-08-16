// models/rent.model.js
const mongoose = require("mongoose");

// Helper function to validate array length
function arrayLimit(val) {
  return val.length <= 20;
}

const RentAssetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  specification: { type: String }, // Not required
  vin: { type: String }, // Not required
  location: { type: String, required: true },
  monthly_rent: { type: Number, required: true },
  vendor: { type: String, required: true },
  approved: {
    type: String,
    enum: ["Approved", "Disapproved", "Return", "Pending"],
    required: true,
    default: "Pending"
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  description: { type: String, required: true },
  comments: { type: String }, // Added comments field, not required
  category: { type: String, required: true },
  payment_method: { type: String, required: true },
  payment_status: { type: String, enum: ["Paid", "Unpaid", "Pending"], required: true },
  created_by: { type: String, required: true }, // Username or email
  staff_name: { type: String, required: true }, // Staff name
  images: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 20 images'],
    default: []
  },
  docs: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 20 documents'],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("RentAsset", RentAssetSchema);