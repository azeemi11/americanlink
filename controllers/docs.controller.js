const Docs = require('../models/docs.model.js');
const path = require('path');

const getDocs = async (req, res) => {
    const docs = await Docs.find();
    res.status(200).json(docs);
};

const createDocs = async (req, res) => {
    console.log('REQ FILE:', req.file);
    console.log('REQ BODY:', req.body);     
    const file = req.file ? `/uploads/${path.basename(req.file.path)}` : null;
    const name = req.body.name;

    if (!file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    const docs = await Docs.create({ file, name });

    if (!docs) {
        return res.status(400).json({
            success: false,
            message: "Docs not created"
        });
    }

    return res.status(201).json({
        success: true,
        message: "Docs created successfully",
        docs
    });
};


const deleteDocs = async (req, res) => {
    const { id } = req.params;
    await Docs.findByIdAndDelete(id);
    res.status(200).json({ message: 'Docs deleted successfully' });
};

module.exports = { getDocs, createDocs, deleteDocs };
