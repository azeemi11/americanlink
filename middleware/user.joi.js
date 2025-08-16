const Joi = require('joi');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must be at most 50 characters long',
      'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    phone: Joi.string().pattern(/^[0-9]{7,15}$/).required().messages({
      'string.pattern.base': 'Phone number must be 7-15 digits',
      'any.required': 'Phone number is required',
    }),
    country: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country must be at most 100 characters long',
      'any.required': 'Country is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required',
    }),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.error('Signup validation error:', error.details);
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((err) => err.message),
      success: false,
    });
  }
};

const loginValidator = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required',
    }),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.error('Login validation error:', error.details);
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((err) => err.message),
      success: false,
    });
  }
};

const adminValidate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        message: 'Access denied, no token provided',
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['admin', 'staff'].includes(decoded.role)) {
      return res.status(403).json({
        message: 'Access denied, requires admin or staff role',
        success: false,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Admin validation error:', error.message);
    return res.status(401).json({
      message: error.name === 'JsonWebTokenError' ? 'Invalid token' : 'Token error',
      success: false,
    });
  }
};

const userValidate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        message: 'Access denied, no token provided',
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['buyer', 'seller'].includes(decoded.role)) {
      return res.status(403).json({
        message: 'Access denied, requires buyer or seller role',
        success: false,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('User validation error:', error.message);
    return res.status(401).json({
      message: error.name === 'JsonWebTokenError' ? 'Invalid token' : 'Token error',
      success: false,
    });
  }
};

module.exports = { signup, loginValidator, adminValidate, userValidate };