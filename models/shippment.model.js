const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({

    OrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    EstimationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Estimation'
      },
      
    InventoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    PaymentId: {
        type: String
    },
    Status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending',
        required: true
    },
    ShipmentDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    ShipmentStatus: {
        type: String,
        enum: ['preparing', 'in_transit', 'delivered'],
        default: 'preparing',
        required: true
    },
    ShipmentAddress: {  
        type: String,
        required: true
    },
    ShipmentCity: {
        type: String,
        required: true
    },
    ShipmentPhone: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
   
},{
    timestamps: true,
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
