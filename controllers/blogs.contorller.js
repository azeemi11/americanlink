const Blogs = require('../models/blogs.model.js');
const path = require('path');

const createBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        const img = req.file ? `/uploads/${path.basename(req.file.path)}` : null;

        const blog = await Blogs.create({ title, description, img });
        if (!blog) {
            return res.status(400).json({
                success: false,
                message: "Blog not created"
            })
        }
        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.find();
        if(!blogs){
            return res.status(400).json({
                success: false,
                message: "No blogs found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            blogs
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blogs.findByIdAndDelete(blogId);
        if (!blog) {
            return res.status(400).json({
                success: false,
                message: "Blog not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message  
        })
    }
}
const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blogs.findById(blogId);
        if (!blog) {
            return res.status(400).json({
                success: false,
                message: "Blog not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blogs.findByIdAndUpdate(blogId, req.body, { new: true });
        if (!blog) {
            return res.status(400).json({
                success: false,
                message: "Blog not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
module.exports = { createBlog, getAllBlogs, deleteBlog, getBlogById, updateBlog };
