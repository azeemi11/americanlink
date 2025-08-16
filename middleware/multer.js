const multer = require("multer");
const path = require("path");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // Ensure uploads/ exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Create the multer instance with storage configuration
const upload = multer({ storage });

module.exports = upload;