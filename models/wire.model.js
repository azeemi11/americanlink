const mongoose = require('mongoose');

const wireSchema = new mongoose.Schema({
  wire: { type: String },
  wireAmount: { type: Number },
  accountName: { type: String },
  accountNumber: { type: String },
  routingNumber: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},  image: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Wire = mongoose.model("Wire", wireSchema);

module.exports = Wire;

