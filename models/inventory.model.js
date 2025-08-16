const mongoose = require('mongoose');

// Helper function to validate array length
function arrayLimit(val) {
    return val.length <= 20;
}

const paymentSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Unique ID for each payment
    amount: { type: Number, required: true, min: 0 },
    vin: { type: String, required: true }, // Added VIN field
    purpose: { type: String, required: true }, // Added purpose field
    receivedBy: { type: String, required: true },
    enteredBy: { type: String, required: true }, // Added enteredBy field
    receivedDate: { type: String, required: true } // Stored as string (e.g., "2025-06-22")
});

const inventorySchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    pricingLocation: { 
        type: String, 
        enum: ['US Price', 'UAE Price', ''], 
        default: '', 
        required: true 
    },
    mileage: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    bodyType: { type: String, required: true },
    driveTerrain: { type: String, required: true },
    color: { type: String, required: true },
    edition: { type: String, required: true },
    condition: { type: String, required: true },
    location: { type: String, required: true },
    engine: { type: String, required: true },
    features: { type: String, required: true }, // Stored as JSON string
    VIN: { type: String, required: true },
    stockLot: { type: String, required: true },
    auction: { type: String, required: true }, // Stored as JSON string
    keyFob: { type: String, required: true },
    description: { type: String },
    descriptionForCustomers: { type: String },
    currentStatus: { 
        type: String, 
        enum: ['On the Way', 'On Hand Without Title', 'On Hand With Title'], 
        default: 'On the Way' 
    },
    images: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 20 images'],
    },
    docs: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 20 documents'],
    },
    status: { 
        type: String, 
        enum: ['Available For Sale', 'Sold'], 
        default: 'Available For Sale' 
    },
    dubaiShipping: { type: Number, default: 0 },
    dubaiClearance: { type: Number, default: 0 },
    storageFee: { type: Number, default: 0 },
    inspectionCharge: { type: Number, default: 0 },
    repairCost: { type: Number, default: 0 },
    VATCustomCharges: { type: Number, default: 0 },
    ATLCharges: { type: Number, default: 0 },
    exitProcessingFee: { type: Number, default: 0 },
    towing: { type: Number, default: 0 },
    soldAmount: { type: Number, default: 0 },
    amountReceived: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    pickUpDate: { type: String },
    deliveryDate: { type: String },
    loadedDate: { type: String },
    exportDate: { type: String },
    ata: { type: String },
    arrivedDateYard: { type: String },
    handedToCustomer: { type: String, default: 'no' },
    soldInDubai: { type: String, default: 'no' },
    inTransit: { type: String, default: 'no' },
    country: { type: String },
    customFee: { type: Number, default: 0 },
    agentFee: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    titleStatus: { 
        type: String, 
        enum: ['received', 'processed', 'dmvProcessed', 'pending', ''], 
        default: '' 
    },
    portOfLoading: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    financialDetailsToggle: { 
        type: String, 
        default: 'On', 
        enum: ['On', 'Off'] 
    },
    uaeShippingToggle: { 
        type: String, 
        default: 'On', 
        enum: ['On', 'Off'] 
    },
    financialDetailsCalculate: { 
        type: String, 
        default: 'Calculate', 
        enum: ['Calculate', 'Not Calculate'] 
    },
    uaeShippingCalculate: { 
        type: String, 
        default: 'Calculate', 
        enum: ['Calculate', 'Not Calculate'] 
    },
    approved: { 
        type: String, 
        enum: ['Approved', 'Disapproved', 'Return', 'Pending'], 
        default: 'Pending' 
    },
    receivedPayments: [paymentSchema]
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;