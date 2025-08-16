const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const allUser = async (req, res) => {
  try {
    const allusers = await User.find({
      $or: [{ role: 'buyer' }, { role: 'staff' }, { role: 'seller' }, { role: 'admin' }],
    });
    res.status(200).json(allusers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, country, phone, password } = req.body;
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, country, phone, password });
    await newUser.save();
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const receiver = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verify your email',
      html: `
        <p>To verify your email, please click the link below:</p>
        <a href="${process.env.FRONTENDURL}/verify/${token}" target="_blank">
          Verify Email
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(receiver);
    res.status(201).json({ message: 'User created successfully and email sent for verification', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.verified) {
      console.log(`Email not verified for user: ${email}`);
      return res.status(400).json({ message: 'Please verify your email' });
    }

    console.log(`Comparing password for user: ${email}`);
    const isPasswordValid = await user.comparePassword(password);
    console.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log(`Incorrect password for user: ${email}`);
      return res.status(401).json({
        message: 'Incorrect password',
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`Login successful for user: ${email}`);
    return res.status(200).json({
      message: 'Login successful',
      success: true,
      jwtToken,
      id: user._id,
      email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error(`Login error for email: ${email}`, error);
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};

const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const checkuser = await User.findOne({ email });
    if (!checkuser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const receiver = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <p>To reset your password, please click the link below:</p>
        <a href="${process.env.FRONTENDURL}/resetpassword/${token}" target="_blank">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(receiver);
    return res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error in forgetpassword:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      console.log('Password is required');
      return res.status(400).json({ message: 'Password is required' });
    }

    console.log(`Attempting to verify token: ${token}`);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Token decoded: ${JSON.stringify(decoded)}`);
    } catch (jwtError) {
      console.error('Token verification error:', jwtError);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      console.log(`User not found for email: ${decoded.email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Updating password for user: ${decoded.email}`);
    user.password = password; // Let pre-save middleware handle hashing
    try {
      await user.save();
      console.log(`Password updated successfully for user: ${decoded.email}, new hash: ${user.password}`);
    } catch (saveError) {
      console.error(`Error saving user password for ${decoded.email}:`, saveError);
      return res.status(500).json({ message: 'Failed to save new password', error: saveError.message });
    }

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Verification link has expired' });
      }
      return res.status(401).json({ message: 'Invalid verification token' });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.verified = true;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

const Updateuser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { allUser, createUser, loginUser, getUser, forgetpassword, resetpassword, verifyEmail, deleteUser, Updateuser };