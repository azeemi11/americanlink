const express = require('express');
const { createBlog, getAllBlogs, deleteBlog, getBlogById, updateBlog } = require("../controllers/blogs.contorller.js")
const upload = require('../middleware/multer.js');

const router = express.Router();

router.post('/create', upload.single('img'), createBlog);
router.get('/', getAllBlogs);
router.delete('/:id', deleteBlog);
router.get('/:id', getBlogById);   
router.put('/:id', updateBlog);

module.exports = router;


