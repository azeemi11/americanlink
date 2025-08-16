const Contact = require('../models/contact.model.js');
const nodemailer = require('nodemailer');
const winston = require('winston');
const mongoose = require('mongoose');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'default@example.com',
    pass: process.env.EMAIL_PASS || 'default_password',
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    logger.error('Nodemailer transporter error:', error);
  } else {
    logger.info('Nodemailer transporter ready');
  }
});

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      logger.warn('Missing required fields:', { name, email, message });
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn('Invalid email format:', { email });
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (message.length < 10) {
      logger.warn('Message too short:', { message });
      return res.status(400).json({ message: 'Message must be at least 10 characters long' });
    }

    const contact = await Contact.create({ name, email, message });
    logger.info('Contact created:', { contactId: contact._id });
    res.status(201).json(contact);
  } catch (error) {
    logger.error('Create contact error:', error);
    return res.status(500).json({ message: 'Failed to create contact: ' + error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    if (!contacts || contacts.length === 0) {
      logger.info('No contacts found');
      return res.status(404).json({ message: 'No contacts found' });
    }
    logger.info(`Retrieved ${contacts.length} contacts`);
    res.status(200).json(contacts);
  } catch (error) {
    logger.error('Get contacts error:', error);
    return res.status(500).json({ message: 'Failed to retrieve contacts: ' + error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    if (!mongoose.isValidObjectId(contactId)) {
      logger.warn('Invalid contact ID:', { contactId });
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      logger.warn('Contact not found:', { contactId });
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    logger.info('Contact deleted:', { contactId });
    return res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      contact,
    });
  } catch (error) {
    logger.error('Delete contact error:', error);
    return res.status(500).json({ message: 'Failed to delete contact: ' + error.message });
  }
};

const replyContact = async (req, res) => {
  try {
    const { contactId, replyMessage } = req.body;

    if (!contactId || !replyMessage) {
      logger.warn('Missing required fields:', { contactId, replyMessage });
      return res.status(400).json({ message: 'Contact ID and reply message are required' });
    }

    if (!mongoose.isValidObjectId(contactId)) {
      logger.warn('Invalid contact ID:', { contactId });
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      logger.warn('Contact not found:', { contactId });
      return res.status(404).json({ message: 'Contact not found' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      logger.warn('Invalid email address:', { email: contact.email });
      return res.status(400).json({ message: 'Invalid contact email address' });
    }

    const companyName = process.env.COMPANY_NAME || 'American Trade Link LLC';
    const mailOptions = {
      from: process.env.EMAIL_USER || 'default@example.com',
      to: contact.email,
      subject: `Re: Your Message to ${companyName}`,
      text: `Dear ${contact.name},\n\nThank you for contacting us. Here is our response:\n\n${replyMessage}\n\nBest regards,\n${companyName}`,
      html: `
        <p>Dear ${contact.name},</p>
        <p>Thank you for contacting us. Here is our response:</p>
        <p>${replyMessage.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>${companyName}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    contact.replied = true;
    await contact.save();

    logger.info('Reply sent successfully:', { contactId, email: contact.email });
    res.status(200).json({ message: 'Reply sent successfully', replied: true });
  } catch (error) {
    logger.error('Reply contact error:', error);
    return res.status(500).json({ message: `Failed to send reply: ${error.message}` });
  }
};

module.exports = { createContact, getContacts, deleteContact, replyContact };