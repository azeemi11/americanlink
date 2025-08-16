const Wire = require("../models/wire.model.js");
const path = require("path");
 const createWire = async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);  // 'file' will be available here as 'receipt'

      const { userId, wire, wireAmount, accountName, accountNumber, routingNumber } = req.body;
      const img = req.file ? `/uploads/${path.basename(req.file.path)}` : null;

      const wires = new Wire({
        userId,
        wire,
        image: img,  // Use 'file' for storing the image path
        wireAmount,
        accountName,
        accountNumber,
        routingNumber,
        
      });

      await wires.save();

      res.status(201).json({ message: "Wire created successfully", wire });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
};


 const getWires = async (req, res) => {
  const wires = await Wire.find();
  res.status(200).json(wires);
};

 const getWireById = async (req, res) => {
  const wire = await Wire.findById(req.params.id);
  res.status(200).json(wire);
};


 const updateWire = async (req, res) => {    
    const { wire, wireAmount, accountName, accountNumber, routingNumber,status } = req.body;
    const user = req.user;
    const wires = await Wire.findByIdAndUpdate(req.params.id, { wire, wireAmount, accountName, accountNumber, routingNumber, status,  user }, { new: true });
    res.status(200).json({ message: "Wire updated successfully", wires });
};

 const deleteWire = async (req, res) => {            
    const wire = await Wire.findByIdAndDelete(req.params.id);
    if (!wire) {
        return res.status(404).json({ message: "Wire not found" });
    } 
    await wire.deleteOne();
      res.status(200).json({ message: "Wire deleted successfully" });
};


module.exports = { createWire, getWires, getWireById, updateWire, deleteWire };

