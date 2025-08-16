const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlist.controller.js");

const router = express.Router();

router.post("/", addToWishlist);
router.get("/:userId", getWishlist);
router.delete("/:userId/:carId", removeFromWishlist);

module.exports = router;