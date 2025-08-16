const express = require('express');
const { createWire, getWires, getWireById, updateWire, deleteWire } = require("../controllers/wire.controller.js");
const upload = require("../middleware/multer.js");
const router = express.Router();

router.post("/", upload.single("image"), createWire);
router.get('/', getWires);
router.get('/:id', getWireById);
router.put('/:id', updateWire);
router.delete('/:id', deleteWire);

module.exports = router;
