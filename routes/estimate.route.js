const express = require('express');
const router = express.Router();
const estimateController = require('../controllers/estimate.controller');

// Send estimate via email
router.post('/send-estimate', estimateController.sendEstimate);

module.exports = router;