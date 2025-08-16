// controllers/rent.controller.js
const RentAsset = require("../models/rent.model.js");

// Create rent asset
const addrent = async (req, res) => {
  try {
    const created_by = req.user.username || req.user.email;

    // Handle image and document file uploads
    let imagePaths = [];
    let docPaths = [];
    if (req.files) {
      if (req.files.images) {
        imagePaths = req.files.images.map(file => `/Uploads/${file.filename}`);
      }
      if (req.files.docs) {
        docPaths = req.files.docs.map(file => `/Uploads/${file.filename}`);
      }
    }

    const asset = new RentAsset({
      ...req.body,
      created_by,
      approved: "Pending", // Ensure default is Pending
      images: imagePaths,
      docs: docPaths,
      comments: req.body.comments || "", // Add comments field
    });
    const saved = await asset.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all assets (admin: all, staff: only own)
const allrent = async (req, res) => {
  try {
    let data;
    if (req.user.role === "admin") {
      data = await RentAsset.find();
    } else {
      const created_by = req.user.username || req.user.email;
      data = await RentAsset.find({ created_by });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single rent asset
const getrent = async (req, res) => {
  try {
    const id = req.params.id;
    const asset = await RentAsset.findById(id);
    if (!asset) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && asset.created_by !== (req.user.username || req.user.email)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update rent asset
const updaterent = async (req, res) => {
  try {
    const id = req.params.id;
    const asset = await RentAsset.findById(id);
    if (!asset) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && asset.created_by !== (req.user.username || req.user.email)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Handle image and document file uploads
    let imagePaths = asset.images || [];
    let docPaths = asset.docs || [];
    if (req.files) {
      if (req.files.images) {
        const newImagePaths = req.files.images.map(file => `/Uploads/${file.filename}`);
        imagePaths = [...imagePaths, ...newImagePaths].slice(0, 20);
      }
      if (req.files.docs) {
        const newDocPaths = req.files.docs.map(file => `/Uploads/${file.filename}`);
        docPaths = [...docPaths, ...newDocPaths].slice(0, 20);
      }
    }

    // Ensure non-admins can't change approval status
    if (req.user.role !== "admin") {
      req.body.approved = "Pending";
    } else if (req.body.approved && !["Approved", "Disapproved", "Return", "Pending"].includes(req.body.approved)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const updatedData = {
      ...req.body,
      images: imagePaths,
      docs: docPaths,
      comments: req.body.comments || "", // Add comments field
    };

    const updated = await RentAsset.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete rent asset
const deleterent = async (req, res) => {
  try {
    const id = req.params.id;
    const asset = await RentAsset.findById(id);
    if (!asset) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && asset.created_by !== (req.user.username || req.user.email)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await RentAsset.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete file (image or document)
const deleteFile = async (req, res) => {
  try {
    const { id, fileType, fileIndex } = req.params;
    const asset = await RentAsset.findById(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (req.user.role !== "admin" && asset.created_by !== (req.user.username || req.user.email)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (fileType !== "image" && fileType !== "document") {
      return res.status(400).json({ message: "Invalid file type" });
    }
    const field = fileType === "image" ? "images" : "docs";
    asset[field].splice(fileIndex, 1);
    await asset.save();
    res.json({ message: `${fileType} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addrent, allrent, getrent, updaterent, deleterent, deleteFile };