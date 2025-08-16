const mongoose = require('mongoose');
const blogsschema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },  
        img:{
            type: String,
            required: true,
        }
    

},
    {
        timestamps: true,
    }
)

const Blogs = mongoose.model('Blogs', blogsschema);

module.exports = Blogs;
