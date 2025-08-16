const express = require('express');
const { AddRegisteration,GetRegisterations,DeleteRegisteration,GetRegisterationByuserId } = require('../controllers/registeration.controller.js');

const router = express.Router();

router.post('/',AddRegisteration);
router.get('/',GetRegisterations);
router.get('/:id',GetRegisterationByuserId);
router.delete('/:id',DeleteRegisteration);
module.exports = router;
