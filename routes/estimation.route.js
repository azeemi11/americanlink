const express = require('express');
const {createEst,getallestimation,deletedata,getestid,deleteEstimation} = require('../controllers/estimation.controller.js');
const router = express.Router();

router.post('/create',createEst)
router.get('/',getallestimation)
router.get('/:id',getestid)
router.delete('/',deletedata)
router.delete('/:id',deleteEstimation)
module.exports=router;