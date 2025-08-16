const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
});     

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;

