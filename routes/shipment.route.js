const express = require('express');
const { 
    Shipment_create, 
    getAllShipments,
    updateShipmentStatus ,
    getUserShipment,deleteShipment
} = require('../controllers/shipment.controller.js');

const router = express.Router();

router.post('/create', Shipment_create);
router.get('/', getAllShipments);
router.put('/:id', updateShipmentStatus);
router.get('/user/:userId', getUserShipment);
router.delete('/:id', deleteShipment);
module.exports = router;

