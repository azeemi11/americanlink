const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

// Send invoice via email

router.post('/send-invoice', invoiceController.sendInvoice);
module.exports = router;