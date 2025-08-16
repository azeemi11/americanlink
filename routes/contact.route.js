const express = require('express');
const { createContact, getContacts, deleteContact, replyContact } = require('../controllers/contact.controller.js');
const router = express.Router();

router.post('/send', createContact);
router.get('/', getContacts);
router.delete('/:id', deleteContact);
router.post('/reply', replyContact);

module.exports = router;