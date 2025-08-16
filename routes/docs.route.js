const express = require('express');
const { getDocs, createDocs, deleteDocs } = require('../controllers/docs.controller.js');

const router = express.Router();
const upload = require('../middleware/multer.js');

router.get('/', getDocs);
router.post('/upload', upload.single('file'), createDocs);
router.delete('/:id', deleteDocs);


module.exports = router;
