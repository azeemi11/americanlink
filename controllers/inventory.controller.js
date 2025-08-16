const Inventory = require("../models/inventory.model.js");
const { v4: uuidv4 } = require('uuid');

// Approval Status Options
const approvalStatusOptions = ['Approved', 'Disapproved', 'Return', 'Pending'];

// Helper function to calculate financial fields
const calculateFinancials = (data, existingInventory) => {
    const financialDetailsFields = data.financialDetailsCalculate === 'Calculate' || existingInventory.financialDetailsCalculate === 'Calculate' ? [
        'dubaiShipping', 'dubaiClearance', 'storageFee', 'inspectionCharge',
        'repairCost', 'VATCustomCharges', 'ATLCharges', 'exitProcessingFee', 'towing'
    ] : [];
    const uaeShippingFields = data.uaeShippingCalculate === 'Calculate' || existingInventory.uaeShippingCalculate === 'Calculate' ? [
        'customFee', 'agentFee'
    ] : [];
    const mandatoryFields = ['soldAmount'];

    const totalCost = [...financialDetailsFields, ...uaeShippingFields, ...mandatoryFields].reduce((sum, field) => {
        return sum + (parseFloat(data[field] || existingInventory[field]) || 0);
    }, 0);
    const amountReceived = (data.receivedPayments || existingInventory.receivedPayments || []).reduce((sum, payment) => {
        return sum + (parseFloat(payment.amount) || 0);
    }, 0);
    const amountDue = totalCost - amountReceived;
    return { totalCost, amountReceived, amountDue };
};

// Get all inventory
const allInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({});
        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Create a new inventory item
const createInventory = async (req, res) => {
    try {
        const { 
            make, model, year, price, pricingLocation, mileage, fuelType, transmission, 
            bodyType, driveTerrain, condition, description, status, userId, location, 
            color, edition, keyFob, auction, stockLot, VIN, features, engine, 
            financialDetailsToggle = 'On', uaeShippingToggle = 'On',
            financialDetailsCalculate = 'Calculate', uaeShippingCalculate = 'Calculate',
            approved = 'Pending' // Added approved field with default
        } = req.body;

        // Check for required fields
        if (!make || !model || !year || !price || !pricingLocation || !mileage || !fuelType || !userId) {
            return res.status(400).json({
                message: "Missing required fields: make, model, year, price, pricingLocation, mileage, fuelType, and userId are mandatory."
            });
        }

        // Convert year, price, and mileage to numbers
        const yearNum = Number(year);
        const priceNum = Number(price);
        const mileageNum = Number(mileage);

        if (isNaN(yearNum) || isNaN(priceNum) || isNaN(mileageNum)) {
            return res.status(400).json({
                message: "Invalid data type: year, price, and mileage must be numbers."
            });
        }

        // Validate financialDetailsToggle
        if (financialDetailsToggle && !['On', 'Off'].includes(financialDetailsToggle)) {
            return res.status(400).json({ message: "Invalid financialDetailsToggle value: must be 'On' or 'Off'" });
        }

        // Validate uaeShippingToggle
        if (uaeShippingToggle && !['On', 'Off'].includes(uaeShippingToggle)) {
            return res.status(400).json({ message: "Invalid uaeShippingToggle value: must be 'On' or 'Off'" });
        }

        // Validate financialDetailsCalculate
        if (financialDetailsCalculate && !['Calculate', 'Not Calculate'].includes(financialDetailsCalculate)) {
            return res.status(400).json({ message: "Invalid financialDetailsCalculate value: must be 'Calculate' or 'Not Calculate'" });
        }

        // Validate uaeShippingCalculate
        if (uaeShippingCalculate && !['Calculate', 'Not Calculate'].includes(uaeShippingCalculate)) {
            return res.status(400).json({ message: "Invalid uaeShippingCalculate value: must be 'Calculate' or 'Not Calculate'" });
        }

        // Validate approved field
        if (approved && !approvalStatusOptions.includes(approved)) {
            return res.status(400).json({ message: "Invalid approved value: must be one of 'Approved', 'Disapproved', 'Return', 'Pending'" });
        }

        // Handle images and docs safely
        const imagePaths = req.files && req.files.images
            ? req.files.images.map(file => `/Uploads/${file.filename}`)
            : [];
        const docPaths = req.files && req.files.docs
            ? req.files.docs.map(file => `/Uploads/${file.filename}`)
            : [];

        // Create inventory item with userId
        const newInventory = await Inventory.create({
            userId,
            make,
            model,
            year: yearNum,
            price: priceNum,
            pricingLocation,
            mileage: mileageNum,
            fuelType,
            transmission,
            bodyType,
            driveTerrain,
            condition,
            description,
            status,
            location,
            color,
            edition,
            engine,
            features,
            VIN,
            stockLot,
            auction,
            keyFob,
            images: imagePaths,
            docs: docPaths,
            financialDetailsToggle,
            uaeShippingToggle,
            financialDetailsCalculate,
            uaeShippingCalculate,
            approved // Added approved field
        });

        return res.status(201).json(newInventory);
    } catch (error) {
        console.error("Error creating inventory:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get inventory by ID
const InventoryByid = async (req, res) => {
    try {
        const id = req.params.id;
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete inventory by ID
const deleteInventory = async (req, res) => {
    try {
        const id = req.params.id;
        const inventory = await Inventory.findByIdAndDelete(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete all inventory
const deleteAllInventory = async (req, res) => {
    try {
        const result = await Inventory.deleteMany();
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json({ message: "All Inventory deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update inventory by ID
const updateInventory = async (req, res) => {
    try {
        const id = req.params.id;

        // Get the existing inventory item
        const existingInventory = await Inventory.findById(id);
        if (!existingInventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        const data = req.body;

        // Parse JSON strings
        if (data.features) {
            try {
                data.features = typeof data.features === 'string' ? data.features : JSON.stringify(data.features);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid features format' });
            }
        }
        if (data.auction) {
            try {
                data.auction = typeof data.auction === 'string' ? data.auction : JSON.stringify(data.auction);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid auction format' });
            }
        }
        if (data.receivedPayments) {
            try {
                data.receivedPayments = typeof data.receivedPayments === 'string'
                    ? JSON.parse(data.receivedPayments)
                    : data.receivedPayments;
                // Validate payment structure
                if (!Array.isArray(data.receivedPayments)) {
                    return res.status(400).json({ message: 'receivedPayments must be an array' });
                }
                for (const payment of data.receivedPayments) {
                    if (!payment.id || !payment.amount || !payment.receivedDate || !payment.receivedBy) {
                        return res.status(400).json({ message: 'Invalid payment data: id, amount, receivedDate, and receivedBy are required' });
                    }
                    if (isNaN(parseFloat(payment.amount)) || parseFloat(payment.amount) < 0) {
                        return res.status(400).json({ message: 'Invalid payment amount' });
                    }
                }
            } catch (error) {
                return res.status(400).json({ message: 'Invalid receivedPayments format' });
            }
        } else {
            data.receivedPayments = existingInventory.receivedPayments; // Preserve existing payments
        }

        // Handle pricingLocation
        if (data.pricingLocation && !['US Price', 'UAE Price', ''].includes(data.pricingLocation)) {
            return res.status(400).json({ message: 'Invalid pricingLocation value' });
        }

        // Validate financialDetailsToggle
        if (data.financialDetailsToggle && !['On', 'Off'].includes(data.financialDetailsToggle)) {
            return res.status(400).json({ message: "Invalid financialDetailsToggle value: must be 'On' or 'Off'" });
        }

        // Validate uaeShippingToggle
        if (data.uaeShippingToggle && !['On', 'Off'].includes(data.uaeShippingToggle)) {
            return res.status(400).json({ message: "Invalid uaeShippingToggle value: must be 'On' or 'Off'" });
        }

        // Validate financialDetailsCalculate
        if (data.financialDetailsCalculate && !['Calculate', 'Not Calculate'].includes(data.financialDetailsCalculate)) {
            return res.status(400).json({ message: "Invalid financialDetailsCalculate value: must be 'Calculate' or 'Not Calculate'" });
        }

        // Validate uaeShippingCalculate
        if (data.uaeShippingCalculate && !['Calculate', 'Not Calculate'].includes(data.uaeShippingCalculate)) {
            return res.status(400).json({ message: "Invalid uaeShippingCalculate value: must be 'Calculate' or 'Not Calculate'" });
        }

        // Validate approved field
        if (data.approved && !approvalStatusOptions.includes(data.approved)) {
            return res.status(400).json({ message: "Invalid approved value: must be one of 'Approved', 'Disapproved', 'Return', 'Pending'" });
        }

        // Process images and docs
        let imagePaths = existingInventory.images || [];
        if (req.files && req.files.images) {
            const newImagePaths = req.files.images.map(file => `/Uploads/${file.filename}`);
            imagePaths = [...imagePaths, ...newImagePaths].slice(0, 20); // Limit to 20 images
        }

        let docPaths = existingInventory.docs || [];
        if (req.files && req.files.docs) {
            const newDocPaths = req.files.docs.map(file => `/Uploads/${file.filename}`);
            docPaths = [...docPaths, ...newDocPaths].slice(0, 20); // Limit to 20 docs
        }

        // Calculate financials
        const { totalCost, amountReceived, amountDue } = calculateFinancials(data, existingInventory);

        // Update with form data, new file paths, and financials
        const updateData = {
            ...data,
            images: imagePaths,
            docs: docPaths,
            totalCost: totalCost.toFixed(2),
            amountReceived: amountReceived.toFixed(2),
            amountDue: amountDue.toFixed(2),
            pricingLocation: data.pricingLocation || existingInventory.pricingLocation, // Preserve existing if not provided
            financialDetailsToggle: data.financialDetailsToggle || existingInventory.financialDetailsToggle, // Preserve existing if not provided
            uaeShippingToggle: data.uaeShippingToggle || existingInventory.uaeShippingToggle, // Preserve existing if not provided
            financialDetailsCalculate: data.financialDetailsCalculate || existingInventory.financialDetailsCalculate || 'Calculate', // Preserve existing or default
            uaeShippingCalculate: data.uaeShippingCalculate || existingInventory.uaeShippingCalculate || 'Calculate', // Preserve existing or default
            approved: data.approved || existingInventory.approved || 'Pending' // Preserve existing or default
        };

        const updatedInventory = await Inventory.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedInventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        return res.status(200).json(updatedInventory);
    } catch (error) {
        console.error("Error updating inventory:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Get inventory by user ID
const getInventoryByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        const inventory = await Inventory.find({ userId });

        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ message: "No inventory found for this user." });
        }

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Add payment to an inventory item
const addPayment = async (req, res) => {
    try {
        const id = req.params.id;
        const { amount, vin, purpose, receivedBy, enteredBy, receivedDate } = req.body;

        // Validate required fields
        if (!amount || !vin || !purpose || !receivedBy || !enteredBy || !receivedDate) {
            return res.status(400).json({ message: "Missing required fields: amount, vin, purpose, receivedBy, enteredBy, and receivedDate are mandatory." });
        }

        // Validate amount
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum < 0) {
            return res.status(400).json({ message: "Invalid amount: must be a non-negative number." });
        }

        // Find the inventory item
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        // Create new payment
        const newPayment = {
            id: uuidv4(), // Generate unique payment ID
            amount: amountNum,
            vin,
            purpose,
            receivedBy,
            enteredBy,
            receivedDate
        };

        // Add payment to receivedPayments array
        inventory.receivedPayments = inventory.receivedPayments || [];
        inventory.receivedPayments.push(newPayment);

        // Recalculate financials
        const { totalCost, amountReceived, amountDue } = calculateFinancials(inventory, inventory);

        // Update inventory with new payment and financials
        inventory.totalCost = totalCost.toFixed(2);
        inventory.amountReceived = amountReceived.toFixed(2);
        inventory.amountDue = amountDue.toFixed(2);

        await inventory.save();

        return res.status(200).json({ message: "Payment added successfully", payment: newPayment });
    } catch (error) {
        console.error("Error adding payment:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Delete payment from an inventory item
const deletePayment = async (req, res) => {
    try {
        const { id, paymentId } = req.params;

        // Find the inventory item
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        // Find and remove the payment
        const paymentIndex = inventory.receivedPayments.findIndex(payment => payment.id === paymentId);
        if (paymentIndex === -1) {
            return res.status(404).json({ message: "Payment not found" });
        }

        inventory.receivedPayments.splice(paymentIndex, 1);

        // Recalculate financials
        const { totalCost, amountReceived, amountDue } = calculateFinancials(inventory, inventory);

        // Update inventory with updated payments and financials
        inventory.totalCost = totalCost.toFixed(2);
        inventory.amountReceived = amountReceived.toFixed(2);
        inventory.amountDue = amountDue.toFixed(2);

        await inventory.save();

        return res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { 
    allInventory, 
    createInventory, 
    InventoryByid, 
    deleteInventory, 
    deleteAllInventory, 
    updateInventory, 
    getInventoryByUserId, 
    addPayment, 
    deletePayment 
};