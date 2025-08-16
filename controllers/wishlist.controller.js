const Wishlist = require("../models/wishlist.model.js");

const addToWishlist = async (req, res) => {
    const { userId, carId } = req.body;
    const existingWishlist = await Wishlist.findOne({ userId, carId });
    if(existingWishlist){
        return res.status(400).json({ message: "Car already in wishlist" });
    }
    const wishlist = await Wishlist.create({ userId, carId });
    if(!wishlist){
        return res.status(400).json({ message: "Failed to add car to wishlist" });
    }
    res.status(201).json({ message: "Car added to wishlist" });
};

 const getWishlist = async (req, res) => {
    const { userId } = req.params;
    const wishlist = await Wishlist.find({ userId });
    res.status(200).json(wishlist);
};  

 const removeFromWishlist = async (req, res) => {
    const { userId, carId } = req.params;
    await Wishlist.findOneAndDelete({ userId, carId });
    if(!Wishlist){
        return res.status(400).json({ message: "Failed to remove car from wishlist" });
    }
    res.status(200).json({ message: "Car removed from wishlist" });
};  


module.exports = { addToWishlist, getWishlist, removeFromWishlist };
