const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Now optional so guests can order
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    payment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending', // Default status
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;