const Estimation = require('../models/estimation.model.js');

// Create a new estimation (prevent duplicates)
const createEst = async (req, res) => {
  const { orderId, userId } = req.body;

  try {
    const existing = await Estimation.findOne({ orderId, userId });
    if (existing) {
      return res.status(400).json({ message: "Estimation already exists for this order" });
    }

    // Create new estimation
    const data = new Estimation({ orderId, userId });
    await data.save();

    return res.status(201).json({ message: "Estimation created successfully", data });
  } catch (error) {
    console.error("Error creating estimation:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all estimations
const getallestimation = async (req, res) => {
  try {
    const data = await Estimation.find();
    // Return empty array if none found, do not return 404
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching estimations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get estimation by ID
const getestid = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Estimation.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Estimation not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching estimation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete ALL estimations
const deletedata = async (req, res) => {
  try {
    const result = await Estimation.deleteMany({});
    res.status(200).json({
      message: 'All estimations deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Failed to delete estimations', error });
  }
};

// Delete ONE estimation by ID
const deleteEstimation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Estimation.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Estimation not found' });
    }

    res.status(200).json({ message: 'Estimation deleted successfully' });
  } catch (error) {
    console.error('Error deleting estimation:', error);
    res.status(500).json({ message: 'Failed to delete estimation', error });
  }
};

// PATCH: Approve an estimation (set approved, approvedBy, approvedAt)
const approveEstimation = async (req, res) => {
  const { id } = req.params;
  const { approvedBy } = req.body;

  try {
    const estimation = await Estimation.findById(id);
    if (!estimation) {
      return res.status(404).json({ message: "Estimation not found" });
    }
    if (estimation.approved) {
      return res.status(400).json({ message: "Estimation already approved" });
    }

    estimation.approved = true;
    estimation.approvedBy = approvedBy || null;
    estimation.approvedAt = new Date();
    await estimation.save();
    res.status(200).json({ message: "Estimation approved", estimation });
  } catch (error) {
    console.error("Error approving estimation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEst,
  getallestimation,
  deletedata,
  getestid,
  deleteEstimation,
  approveEstimation,
};