const express = require('express');
const { createUser, loginUser,allUser,getUser,forgetpassword ,resetpassword,verifyEmail,deleteUser,Updateuser} = require('../controllers/user.contorller.js')
const { adminValidate, userValidate,loginValidator, signup } = require('../middleware/user.joi.js');

const router = express.Router();

router.post('/signup', signup, createUser);
router.post('/login',loginValidator, loginUser); 
router.get('/',allUser);
router.get('/:id',getUser);
router.post('/forgetpassword',forgetpassword);
router.post('/resetpassword/:token',resetpassword);
router.get('/verify/:token',verifyEmail);
router.delete('/:id',deleteUser);
router.put('/:id',Updateuser);

module.exports = router;
