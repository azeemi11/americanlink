const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'staff', 'admin'], default: 'buyer' },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

authSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`Hashed password for ${this.email}: ${this.password}`);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

authSchema.methods.comparePassword = async function (password) {
  try {
    console.log(`Comparing password for ${this.email}: provided=${password}, stored=${this.password}`);
    const isValid = await bcrypt.compare(password, this.password);
    console.log(`Password comparison result for ${this.email}: ${isValid}`);
    return isValid;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};

const User = mongoose.model('User', authSchema);

module.exports = User;