const Shipment = require('../models/shippment.model.js');
const Order = require('../models/order.model.js');

const Shipment_create = async (req, res) => {
    try {
      const { OrderId, EstimationId } = req.body;
  
      // Get order details
      const order = await Order.findById(OrderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Create new shipment
      const newShipment = new Shipment({
        OrderId: order._id,
        UserId: order.userId,
        EstimationId,
        InventoryId: order.carId,
        name: order.name,
        Status: 'pending',
        ShipmentDate: new Date(),
        ShipmentStatus: 'preparing',
        ShipmentCity: order.country,
        ShipmentPhone: order.phone,
        totalPrice: order.price,
        ShipmentAddress: order.address || 'Default Address'
      });
  
      await newShipment.save();
  
      // Update order status
      order.status = 'processing';
      await order.save();
  
      res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        shipment: newShipment
      });
  
    } catch (error) {
      console.error('Shipment creation error:', error);
      res.status(500).json({
        success: false,
        message: "Error creating shipment",
        error: error.message
      });
    }
  };
  
 const getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find()
            .sort({ ShipmentDate: -1 }); // Most recent first
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shipments", error: error.message });
    }
};

 const updateShipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { ShipmentStatus } = req.body;
        
        const shipment = await Shipment.findByIdAndUpdate(
            id,
            { ShipmentStatus },
            { new: true }
        );
        
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }
        
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: "Error updating shipment", error: error.message });
    }
};

 const getUserShipment = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Received request for userId:", userId);

        // Find all shipments for the user, sorted by date
        const shipments = await Shipment.find({ UserId: userId })
            .sort({ ShipmentDate: -1 });

        console.log("Found shipments:", shipments);

        if (!shipments || shipments.length === 0) {    
            console.log("No shipments found for userId:", userId);
            return res.status(404).json({ 
                message: "No shipments found for this user",
                userId: userId
            });
        }

        res.json(shipments);
    } catch (error) {
        console.error("Error in getUserShipment:", error);
        res.status(500).json({ 
            message: "Error fetching shipment", 
            error: error.message 
        });             
    }
};
 const deleteShipment = async (req, res) => {
    try {
        const { id } = req.params;
        await Shipment.findByIdAndDelete(id);
        res.status(200).json({ message: "Shipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shipment", error: error.message });
    }
};
    
module.exports = { Shipment_create, getAllShipments, updateShipmentStatus, getUserShipment, deleteShipment };
