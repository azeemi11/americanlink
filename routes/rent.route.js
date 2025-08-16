const express = require("express");
const { addrent, allrent, getrent, updaterent, deleterent } = require('../controllers/rent.controller.js');
const extractUser = require('../middleware/auth.js');
const upload = require('../middleware/multer.js');
const router = express.Router();

router.use(extractUser);

router.post("/", upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'docs', maxCount: 20 }
]), addrent);

router.get("/", allrent);
router.get("/:id", getrent);

router.put("/:id", upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'docs', maxCount: 20 }
]), updaterent);

router.delete("/:id", deleterent);

module.exports = router;