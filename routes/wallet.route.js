const express = require('express');
const { createWallet, getwallet,updatedep,approveDeposit,verifyWalletTransaction } = require('../controllers/wallet.controller.js');

const router = express.Router();

// Route to create a wallet
router.post('/create', createWallet);

// Route to get wallet details
router.get('/', getwallet);
router.post('/deposit',updatedep)
router.post('/approve/:walletId', approveDeposit);
router.get('/verify/:token', verifyWalletTransaction);

module.exports = router;

  