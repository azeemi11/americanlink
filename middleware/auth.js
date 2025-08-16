const jwt = require("jsonwebtoken");

// Middleware to extract user info from JWT token in Authorization header
function extractUser(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded; // user info is now available as req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = extractUser;