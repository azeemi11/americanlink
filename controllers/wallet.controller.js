const Wallet = require('../models/wallet.model.js');
const jwt = require('jsonwebtoken');

// Create Wallet
const createWallet = async (req, res) => {
  const { userId, email,accountnumber } = req.body;
  const amount = 0;

  try {
    const existingWallet = await Wallet.findOne({ userId });

    if (existingWallet) {
      return res.status(400).json({ message: "Wallet already exists for this user." });
    }

const req_deposit = 0
    const newWallet = new Wallet({
      userId,
      email,
      amount,
      req_deposit,
      accountnumber,
    });

    await newWallet.save();

    return res.status(201).json({ message: "Wallet created successfully", wallet: newWallet });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Wallets
const getwallet = async (req, res) => {
  try {
    const wallets = await Wallet.find();

    if (!wallets || wallets.length === 0) {
      return res.status(404).json({ message: "No wallets found." });
    }

    return res.status(200).json({ wallets });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updatedep = async (req, res) => {
  const { walletId, amount } = req.body;

  try {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.req_deposit += amount;
    await wallet.save();

    res.json({ message: "Deposit successful", wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const approveDeposit = async (req, res) => {
  try {
    const { walletId } = req.params;
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.amount += wallet.req_deposit;
    wallet.req_deposit = 0;

    await wallet.save();

    res.status(200).json({ message: 'Deposit approved', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyWalletTransaction = async (req, res) => {
  try {
    const { token } = req.params;

    // Decode JWT (replace YOUR_SECRET with your actual secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "YOUR_SECRET");
console.log(decoded)
    // Use the decoded userId to find the wallet
    const wallet = await Wallet.findOne({ userId: decoded.userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.req_deposit && wallet.req_deposit > 0) {
      // Update wallet amount and reset req_deposit
      wallet.amount += wallet.req_deposit;
      wallet.req_deposit = 0;
      await wallet.save();

      return res.status(200).json({ message: 'Deposit verified and updated.' });
    } else {
      return res.status(400).json({ message: 'No pending deposit to verify.' });
    }
  } catch (error) {
    console.error('Verification failed:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      return res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = { createWallet, getwallet ,updatedep,approveDeposit,verifyWalletTransaction };
